import { Component, OnInit } from "@angular/core";
import { VehicleGetAllDto, VehicleGetAllItemDto, VehiclesService, ViewState } from "src/app/core";

@Component({
    selector: 'vehicles',
    templateUrl: './vehicles.component.html'
})
export class VehiclesComponent implements OnInit {
    vehicles?: VehicleGetAllItemDto[];

    entityModalShow: boolean = false;
    entityState: ViewState = ViewState.Details;
    entityId?: string;

    constructor(private vehiclesService: VehiclesService) {}

    ngOnInit(): void {
        this.getAll();
    }

    entityDetails(id?: string) {
        this.entityModalShow = true;
        this.entityId = id;
        this.entityState = ViewState.Details;
    }

    entityModalClose() {
        this.entityModalShow = false;
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
}