import { Component, OnInit } from "@angular/core";
import { ChargerGetAllDto, ChargerGetAllItemDto, ChargersService, ViewState } from "src/app/core";

@Component({
    selector: 'chargers',
    templateUrl: './chargers.component.html'
})
export class ChargersComponent implements OnInit {
    chargers?: ChargerGetAllItemDto[];

    entityModalShow: boolean = false;
    entityState: ViewState = ViewState.Details;
    entityId?: string;

    constructor(private chargersService: ChargersService) {}

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
          this.chargersService.getAll().then((response: ChargerGetAllDto) => {
            this.chargers = response.items;
            resolve();
          })
        });
    }
}