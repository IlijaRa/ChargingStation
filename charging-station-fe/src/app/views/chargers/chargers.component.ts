import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ChargerSearchItemDto, ChargersService, ViewState } from "src/app/core";
import { ChargerAddEditComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";

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

    handleClick($event: any) {
        $event.stopPropagation();
    }
    
    select(item: any) {
        this.selectedItem = item;
    }

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
            },
            error: (err: any) => {
              console.error(err);
            }
        })
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