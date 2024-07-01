import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChargerGetByIdDto, ChargerSaveDto, ChargersService, IAddressResult, IResult, MapsService, ViewState } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';

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

  mapboxAddressResults?: IResult[];
  addresses: IAddressResult[] = [];
  selectedAddress?: string;
  latitude: number = 90;
  longitude: number = 90;

  constructor(
    private mapsService: MapsService,
    private formBuilder: FormBuilder,
    private chargersService: ChargersService,
    private dialogRef: DialogRef<ChargerAddEditComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) data: { id: string, state?: ViewState }) 
    {
      this.entityId = data.id;
      this.state = data.state;
      if (this.entityId) {
        this.chargersService.getById(this.entityId).subscribe({
          next: (val: any) => {
            this.latitude = val.latitude;
            this.longitude = val.longitude;
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

  ngOnInit(): void { }

  save() {
    if (this.form?.valid) {
      let model: ChargerSaveDto = {
        _id: this.entityId,
        chargingPower: this.form?.value.chargingPower,
        chargingProtocol: this.form?.value.chargingProtocol,
        pricePerKwh: this.form?.value.pricePerKwh,
        paymentMethod: this.form?.value.paymentMethod,
        location: this.form?.value.location,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.chargersService.save(model).subscribe({
        next: (val: any) => {
          this.toastr.success("Charger saved successfully!", "Success message", { timeOut: 5000 });
          this.cancel();
        },
        error: (err: any) => {
          this.toastr.error(err.message, "Error message", { timeOut: 5000 });
          this.errorMessages = err.message;
        }
      })
    }
  }

  search(event?: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm && searchTerm.length > 0) {
      this.mapsService.searchAddress(searchTerm)?.subscribe((features: IResult[]) => {
        this.addresses = features.map(result => ({
          id: result.id,
          name: result.properties?.full_address || '',
          latitude: result.geometry?.coordinates ? result.geometry.coordinates[1] : 90,
          longitude: result.geometry?.coordinates ? result.geometry.coordinates[0] : 90,
        }));
        this.mapboxAddressResults = features;
      });
    } else {
      this.addresses = [];
    }
  }

  onSelect(address: IAddressResult) {
    this.selectedAddress = address.name;
    this.latitude = address.latitude!;
    this.longitude = address.longitude!;
    this.addresses = [];
  }

  cancel() {
    this.dialogRef.close();
  }
}
