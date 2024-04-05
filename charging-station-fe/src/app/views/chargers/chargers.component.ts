import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ChargerGetAllDto, ChargerGetAllItemDto, ChargersService, ViewState } from "src/app/core";
import { ChargerAddEditComponent } from ".";

@Component({
    selector: 'chargers',
    templateUrl: './chargers.component.html',
    styleUrls: ['./chargers.component.css']
})
export class ChargersComponent implements OnInit {
    chargers?: ChargerGetAllItemDto[];
    displayedColumns: string[] = ['location', 'chargingProtocol', 'chargingPower', 'pricePerKwh', 'paymentMethod', 'id'];
    // entityModalShow: boolean = false;
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

    constructor(private chargersService: ChargersService, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.getAll();
    }

    // entityDetails(id?: string) {
    //     this.entityModalShow = true;
    //     this.entityId = id;
    //     this.entityState = ViewState.Details;
    // }

    // entityModalClose() {
    //     this.entityModalShow = false;
    // }

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

    deleteCharger(chargerId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.chargersService.delete(chargerId).then((response: void) => {
                this.getAll();
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