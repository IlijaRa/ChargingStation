import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ChargerGetAllItemDto, ChargerSearchItemDto, ChargersService, ViewState } from "src/app/core";
import { ChargerAddEditComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'chargers',
    templateUrl: './chargers.component.html',
    styleUrls: ['./chargers.component.css']
})
export class ChargersComponent implements OnInit {
    form?: FormGroup;
    chargers?: ChargerSearchItemDto[];
    displayedColumns: string[] = ['location', 'chargingProtocol', 'chargingPower', 'pricePerKwh', 'paymentMethod', 'id'];
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    selectedItem: any;
    querySearch?: string = undefined;

    pageEvent?: PageEvent;
    dataSource: any;
    pageSize: number = 8;
    currentPage: number = 0;
    totalSize: number = 0;

    @ViewChild(MatPaginator) paginator?: MatPaginator;
    
    // handleClick($event: any) {
    //     $event.stopPropagation();
    // }
    
    // select(item: any) {
    //     this.selectedItem = item;
    // }

    constructor(private formBuilder: FormBuilder, private chargersService: ChargersService, private matDialog: MatDialog) 
    {
        this.form = this.formBuilder.group({
            query: new FormControl(this.querySearch),
        });
    }

    ngOnInit(): void {
        this.search();
    }

    entityActionCallback() {
    }

    search() {
        this.chargersService.search(this.querySearch ?? "").subscribe({
            next: (val: any) => {
                this.chargers = val.items;
                this.dataSource = new MatTableDataSource<ChargerSearchItemDto>(val.items);
                this.dataSource.paginator = this.paginator;
                this.totalSize = this.chargers?.length!;
                this.iterator();
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    handlePageEvent(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
        this.iterator();
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.chargers?.slice(start, end);
        this.dataSource = part;
    }

    deleteCharger(chargerId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.chargersService.delete(chargerId).then((response: void) => {
                this.search();
                resolve();
            })
        });
    }

    openDialog(id?: string, viewState?: ViewState) {
        this.matDialog.open(ChargerAddEditComponent, {
            autoFocus: false,
            data: {
                id: id,
                state: viewState
            },
            width: '427px',
            height: '609px'
        })
        .afterClosed()
        .subscribe((res) => {
          this.search();
        });
    }

    openDeleteDialog(id?: string) {
        this.matDialog.open(ConfirmActionDialogComponent, {
            autoFocus: false,
            data: {
                actionName: 'Delete',
                entityName: 'charger'
            },
            width: '427px',
            height: '215px'
        })
        .afterClosed()
        .subscribe((res) => {
            if (res === 'ok') {
                this.deleteCharger(id).then(() => {
                    this.search();
                })
            }
        });
    }
}