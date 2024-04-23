import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { VehicleSearchItemDto, ViewState, VehiclesService, AccountsService, CurrentUserDto } from "src/app/core";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";
import { switchMap } from "rxjs";
import { UserVehicleAddEditComponent } from ".";

@Component({
    selector: 'user-vehicles',
    templateUrl: './user-vehicles.component.html',
    styleUrls: ['./user-vehicles.component.css']
})
export class UserVehiclesComponent {
    form?: FormGroup;
    vehicles?: VehicleSearchItemDto[];
    displayedColumns: string[] = ['manufacturer', 'vehicleModel', 'batteryCapacity', 'chargingProtocol', 'id'];
    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    selectedItem: any;
    querySearch?: string = undefined;
    user?: CurrentUserDto;
    
    handleClick($event: any) {
      $event.stopPropagation();
    }
  
    select(item: any) {
      this.selectedItem = item;
    }

    constructor(
        private formBuilder: FormBuilder, 
        private vehiclesService: VehiclesService, 
        private accountsService: AccountsService, 
        private matDialog: MatDialog) 
    {
        this.form = this.formBuilder.group({
            query: new FormControl(this.querySearch),
        });
    }

    ngOnInit(): void {
        this.accountsService.getCurrentUser().pipe(
            switchMap((user: any) => {
                this.user = user;
                // Return the observable from the inner function
                return this.vehiclesService.search(this.querySearch ?? "", this.user?._id ?? "");
            })
        ).subscribe({
            next: (vehicles: any) => {
                this.vehicles = vehicles.items;
            },
            error: (err: any) => {
                console.error(err);
            }
        });
    }

    getAll(userId?: string) {
        this.vehiclesService.getAllByUserId(userId).subscribe({
            next: (val: any) => {
                this.vehicles = val.items;
            },
            error: (err: any) => {
                console.error(err);
            }
        })
    }

    search(userId?: string) {
        this.vehiclesService.search(this.querySearch ?? "", userId ?? "").subscribe({
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
                this.search(this.user?._id);
                // this.getAll(this.user?._id);
                resolve();
            })
        });
    }

    openDialog(id?: string, viewState?: ViewState) {
        this.matDialog.open(UserVehicleAddEditComponent, {
            autoFocus: false,
            data: {
                id: id,
                userId: this.user?._id,
                userFullName: `${this.user?.firstName} ${this.user?.lastName}`,
                state: viewState
            },
            width: '427px',
            height: '609px'
        })
        .afterClosed()
        .subscribe((res) => {
            this.search(this.user?._id);
            // this.getAll(this.user?._id);
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
                    this.search(this.user?._id);
                    // this.getAll(this.user?._id);
                })
            }
        });
    }
}