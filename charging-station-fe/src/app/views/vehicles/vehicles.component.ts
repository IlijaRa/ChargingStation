import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VehicleSearchItemDto, VehiclesService, ViewState } from "src/app/core";
import { VehicleAddEditComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'vehicles',
    templateUrl: './vehicles.component.html',
    styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  form?: FormGroup;
    vehicles?: VehicleSearchItemDto[];
    displayedColumns: string[] = ['manufacturer', 'vehicleModel', 'batteryCapacity', 'chargingProtocol', 'id'];
    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    selectedItem: any;
    querySearch?: string = undefined;
    
    pageEvent?: PageEvent;
    dataSource: any;
    pageSize: number = 7;
    currentPage: number = 0;
    totalSize: number = 0;

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    constructor(private formBuilder: FormBuilder, private vehiclesService: VehiclesService, private matDialog: MatDialog) 
    {
      this.form = this.formBuilder.group({
        query: new FormControl(this.querySearch),
    });
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
      this.vehiclesService.search(this.querySearch ?? "").subscribe({
          next: (val: any) => {
              this.vehicles = val.items;
              this.dataSource = new MatTableDataSource<VehicleSearchItemDto>(val.items);
                this.dataSource.paginator = this.paginator;
                this.totalSize = this.vehicles?.length!;
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
        const part = this.vehicles?.slice(start, end);
        this.dataSource = part;
    }

    deleteVehicle(vehicleId?: string): Promise<void> {
      return new Promise((resolve: any) => {
          this.vehiclesService.delete(vehicleId).then((response: void) => {
              this.search();
              resolve();
          })
      });
    }

    openDialog(id?: string, viewState?: ViewState) {
        this.matDialog.open(VehicleAddEditComponent, {
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
            entityName: 'vehicle'
          },
          width: '427px',
          height: '215px'
      })
      .afterClosed()
      .subscribe((res) => {
          if (res === 'yes') {
              this.deleteVehicle(id).then(() => {
                  this.search();
              })
          }
      });
    }
}