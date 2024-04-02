import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserAllDto, UserAllItemDto, UsersService, VehicleGetByIdDto, VehicleSaveDto, VehiclesService, ViewState } from 'src/app/core';

@Component({
  selector: 'app-vehicle-add-edit',
  templateUrl: './vehicle-add-edit.component.html',
  styleUrls: ['./vehicle-add-edit.component.css']
})
export class VehicleAddEditComponent implements OnInit {
  form?: FormGroup;
  vehicle?: VehicleGetByIdDto;
  drivera?: UserAllItemDto;
  drivers?: UserAllItemDto[];
  viewState = ViewState;
  state?: ViewState;
  disabled?: boolean;
  entityId: string;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private vehiclesService: VehiclesService, 
    private dialogRef: DialogRef<VehicleAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { id: string, state?: ViewState }) 
    {
      this.entityId = data.id;
      this.state = data.state;
      if (this.entityId) {
        this.vehiclesService.getById(this.entityId).subscribe({
          next: (val: any) => {
            this.disabled = this.state == this.viewState.Details;
            this.form = this.formBuilder.group({
              manufacturer: new FormControl({ value : val?.manufacturer, disabled: this.disabled }),
              vehicleModel: new FormControl({ value : val?.vehicleModel, disabled: this.disabled }),
              batteryCapacity: new FormControl({ value : val?.batteryCapacity, disabled: this.disabled }),
              chargingProtocol: new FormControl({ value : val?.chargingProtocol, disabled: this.disabled }),
              userId: new FormControl({ value : val?.userId, disabled: this.disabled })
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          manufacturer: '', vehicleModel: '', batteryCapacity: '', chargingProtocol: '', userId: ''
        });
      }
  }

  ngOnInit(): void {
    this.getAllDrivers();
  }

  private getAllDrivers(): Promise<void> {
    return new Promise((resolve: any) => {
      this.usersService.all().then((response: UserAllDto) => {
        this.drivers = response.items;
        resolve();
      })
    });
  }

  get userId() {
    return this.form?.get('userId');
  }

  save() {
    if (this.form?.valid) {
      let model: VehicleSaveDto = {
        _id: this.entityId,
        manufacturer: this.form?.value.manufacturer,
        vehicleModel: this.form?.value.vehicleModel,
        batteryCapacity: this.form?.value.batteryCapacity,
        chargingProtocol: this.form?.value.chargingProtocol,
        userId: this.form?.value.userId
      };
      this.vehiclesService.save(model).subscribe({
        next: (val: any) => {
          this.cancel();
        },
        error: (err: any) => {
          console.error(err);
        }
      })
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
