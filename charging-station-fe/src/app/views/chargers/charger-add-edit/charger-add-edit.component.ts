import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  errorMessages: any = undefined;
  
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
              chargingPower: new FormControl(val?.chargingPower, [Validators.required]),
              chargingProtocol: new FormControl(val?.chargingProtocol, [Validators.required]),
              pricePerKwh: new FormControl(val?.pricePerKwh, [Validators.required]),
              paymentMethod: new FormControl(val?.paymentMethod, [Validators.required]),
              location: new FormControl(val?.location, [Validators.required]),
              latitude: new FormControl(val?.latitude, [Validators.required]),
              longitude: new FormControl(val?.longitude, [Validators.required])
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          chargingPower: new FormControl('', [Validators.required]), 
          chargingProtocol: new FormControl('', [Validators.required]), 
          pricePerKwh: new FormControl('', [Validators.required]), 
          paymentMethod: new FormControl('', [Validators.required]), 
          location: new FormControl('', [Validators.required]), 
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
          this.errorMessages = err.message;
        }
      })
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
