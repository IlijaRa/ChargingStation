import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VehicleGetAllDto, VehicleGetAllItemDto, VehiclesService, ViewState } from "src/app/core";
import { VehicleAddEditComponent } from ".";

@Component({
    selector: 'vehicles',
    templateUrl: './vehicles.component.html'
})
export class VehiclesComponent implements OnInit {
    vehicles?: VehicleGetAllItemDto[];

    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;

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

    openVehicleDialog(id?: string, viewState?: ViewState) {
        this.matDialog.open(VehicleAddEditComponent, {
            autoFocus: false,
            data: {
                id: id,
                state: viewState
            }
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