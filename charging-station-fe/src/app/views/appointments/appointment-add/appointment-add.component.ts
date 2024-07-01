import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentGetByIdDto, AppointmentSaveDto, AppointmentsService, ViewState } from 'src/app/core';
import { ChargerAddEditComponent } from '../../chargers';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css']
})
export class AppointmentAddComponent implements OnInit {
  form?: FormGroup;
  appointment?: AppointmentGetByIdDto;
  viewState = ViewState;
  entityId: string;
  chargerId?: string;

  constructor(
    private formBuilder: FormBuilder,
    private appointmentsService: AppointmentsService,
    private dialogRef: DialogRef<ChargerAddEditComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) data: { id: string, chargerId?: string }) 
    {
      this.entityId = data.id;
      this.chargerId = data.chargerId;
      if (this.entityId) {
        this.appointmentsService.getById(this.entityId).subscribe({
          next: (val: any) => {
            this.form = this.formBuilder.group({
              startTime: new FormControl(val?.startTime),
              endTime: new FormControl(val?.endTime),
              isAvailable: new FormControl(val?.isAvailable)
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          startTime: '', endTime: '', isAvailable: ''
        });
      }
  }

  ngOnInit(): void {
  }

  save() {
    if (this.form?.valid) {
      let model: AppointmentSaveDto = {
        _id: this.entityId,
        startTime: this.form?.value.startTime,
        endTime: this.form?.value.endDate,
        isAvailable: this.form?.value.isAvailable == 'yes' ? true : false,
        chargerId: this.chargerId
      };
      this.appointmentsService.save(model).subscribe({
        next: (val: any) => {
          this.toastr.success("Appointment saved successfully!", "Success message", { timeOut: 5000 });
          this.cancel();
        },
        error: (err: any) => {
          this.toastr.error(err.message, "Error message", { timeOut: 5000 });
          console.error(err);
        }
      })
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
