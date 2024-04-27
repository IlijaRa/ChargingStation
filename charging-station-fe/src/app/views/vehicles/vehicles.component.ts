import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VehicleSearchItemDto, VehiclesService, ViewState } from "src/app/core";
import { VehicleAddEditComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";

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
    
    handleClick($event: any) {
      $event.stopPropagation();
    }
  
    select(item: any) {
      this.selectedItem = item;
    }

    constructor(private formBuilder: FormBuilder, private vehiclesService: VehiclesService, private matDialog: MatDialog) 
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
      this.vehiclesService.search(this.querySearch ?? "").subscribe({
          next: (val: any) => {
              this.vehicles = val.items;
          },
          error: (err: any) => {
            console.error(err);
          }
      })
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
          if (res === 'ok') {
              this.deleteVehicle(id).then(() => {
                  this.search();
              })
          }
      });
    }
}