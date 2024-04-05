import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChargerGetByIdDto, ChargerSaveDto, ChargersService, ViewState } from 'src/app/core';

@Component({
  selector: 'app-charger-add-edit',
  templateUrl: './charger-add-edit.component.html',
  styleUrls: ['./charger-add-edit.component.css']
})
export class ChargerAddEditComponent implements OnInit {
  form?: FormGroup;
  charger?: ChargerGetByIdDto;
  viewState = ViewState;
  state?: ViewState;
  disabled?: boolean;
  entityId: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private chargersService: ChargersService,
    private dialogRef: DialogRef<ChargerAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { id: string, state?: ViewState }) 
    {
      this.entityId = data.id;
      this.state = data.state;
      if (this.entityId) {
        this.chargersService.getById(this.entityId).subscribe({
          next: (val: any) => {
            this.disabled = this.state == this.viewState.Details;
            this.form = this.formBuilder.group({
              chargingPower: new FormControl(val?.chargingPower),
              chargingProtocol: new FormControl(val?.chargingProtocol),
              pricePerKwh: new FormControl(val?.pricePerKwh),
              paymentMethod: new FormControl(val?.paymentMethod),
              location: new FormControl(val?.location),
              latitude: new FormControl(val?.latitude),
              longitude: new FormControl(val?.longitude)
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          chargingPower: '', chargingProtocol: '', pricePerKwh: '', paymentMethod: '', location: ''
        });
      }
  }

  ngOnInit(): void {
  }

  save() {
    if (this.form?.valid) {
      let model: ChargerSaveDto = {
        _id: this.entityId,
        chargingPower: this.form?.value.chargingPower,
        chargingProtocol: this.form?.value.chargingProtocol,
        pricePerKwh: this.form?.value.pricePerKwh,
        paymentMethod: this.form?.value.paymentMethod,
        location: this.form?.value.location,
        latitude: 100.00,//this.form?.value.latitude,
        longitude: 100.00,//this.form?.value.longitude,
      };
      this.chargersService.save(model).subscribe({
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
