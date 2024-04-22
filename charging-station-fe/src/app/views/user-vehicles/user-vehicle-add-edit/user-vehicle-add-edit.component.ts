import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleGetByIdDto, UserAllItemDto, ViewState, UsersService, VehiclesService, UserAllDto, VehicleSaveDto, AccountsService } from 'src/app/core';
import { VehicleAddEditComponent } from '../../vehicles';

@Component({
  selector: 'app-user-vehicle-add-edit',
  templateUrl: './user-vehicle-add-edit.component.html',
  styleUrls: ['./user-vehicle-add-edit.component.css']
})
export class UserVehicleAddEditComponent {
  form?: FormGroup;
  vehicle?: VehicleGetByIdDto;
  viewState = ViewState;
  state?: ViewState;
  disabled?: boolean;
  entityId: string;
  driverId: string;

  constructor(
    private formBuilder: FormBuilder,
    private vehiclesService: VehiclesService, 
    private dialogRef: DialogRef<VehicleAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { id: string, userId: string, userFullName: string, state?: ViewState }) 
    {
      this.entityId = data.id;
      this.driverId = data.userId
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
              userFullName: new FormControl(data.userFullName)
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          manufacturer: '', vehicleModel: '', batteryCapacity: '', chargingProtocol: '', userFullName: data.userFullName
        });
      }
  }

  ngOnInit(): void { }

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
        userId: this.driverId
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
