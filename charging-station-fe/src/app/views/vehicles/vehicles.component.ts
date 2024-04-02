import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VehicleGetAllDto, VehicleGetAllItemDto, VehiclesService, ViewState } from "src/app/core";
import { VehicleAddEditComponent } from ".";

@Component({
    selector: 'vehicles',
    templateUrl: './vehicles.component.html',
    styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
    vehicles?: VehicleGetAllItemDto[];
    displayedColumns: string[] = ['manufacturer', 'vehicleModel', 'batteryCapacity', 'chargingProtocol', 'id'];
    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    selectedItem: any;
    
    handleClick($event: any) {
      $event.stopPropagation();
    }
  
    select(item: any) {
      this.selectedItem = item;
    }

    constructor(private vehiclesService: VehiclesService, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.getAll();
    }

    entityActionCallback() {
    }

    private getAll(): Promise<void> {
        return new Promise((resolve: any) => {
          this.vehiclesService.getAll().then((response: VehicleGetAllDto) => {
            this.vehicles = response.items;
            resolve();
          })
        });
    }

    deleteVehicle(vehicleId?: string): Promise<void> {
      return new Promise((resolve: any) => {
          this.vehiclesService.delete(vehicleId).then((response: void) => {
              this.getAll();
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
          this.getAll();
        //   setTimeout(() => {
        //     if (viewState == ViewState.Create) {
        //         alert("Employee added successfully!");
        //     } 
            
        //     if (viewState == ViewState.Edit) {
        //         alert("Employee updated successfully!");
        //     }
        //   }, 500);
        });
    }
}