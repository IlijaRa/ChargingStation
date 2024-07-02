import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountsService, AppointmentAllItemDto, AppointmentsService, ChargerGetByIdDto, ChargersService, CurrentUserDto, ScheduleChargerSaveDto, ScheduleChargersService, VehicleGetAllItemDto, VehiclesService } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedule-charger-add',
  templateUrl: './schedule-charger-add.component.html',
  styleUrls: ['./schedule-charger-add.component.css']
})
export class ScheduleChargerAddComponent {
  form?: FormGroup;
  
  chargerId: string;
  charger?: ChargerGetByIdDto;
  user?: CurrentUserDto;
  appointments?: AppointmentAllItemDto[];
  vehicles?: VehicleGetAllItemDto[];
  selectedAppointmentId?: string;
  selectedVehicleId?: string;

  errorMessages: any = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private accountsService: AccountsService,
    private chargersService: ChargersService,
    private appointmentsService: AppointmentsService,
    private vehiclesService: VehiclesService,
    private scheduleChargersService: ScheduleChargersService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dialogRef: DialogRef<ScheduleChargerAddComponent>,
    @Inject(MAT_DIALOG_DATA) data: { chargerId: string}) 
  {
      this.chargerId = data.chargerId;
  }

  ngOnInit(): void {
    Promise.all([this.getCurrentUser(), this.getChargerById(this.chargerId)])
      .then(() => {
        this.getDriverVehicles(this.user?._id);
        this.initForm();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onDateChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      this.date = new Date(dateValue).toISOString();
      this.getAllAppointments(this.chargerId, this.date);
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      location: new FormControl(this.charger?.location, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      appointments: new FormControl(null, [Validators.required]),
      vehicles: new FormControl(null, [Validators.required]),
      driver: new FormControl(`${this.user?.firstName} ${this.user?.lastName}`, [Validators.required]),
    });
  }

  private getCurrentUser(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.accountsService.getCurrentUser().subscribe({
        next: (user: any) => {
          this.user = user;
          resolve();
        },
        error: (err: any) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

  private getChargerById(chargerId?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.chargersService.getById(chargerId).subscribe({
        next: (val: any) => {
          this.charger = val;
          resolve();
        },
        error: (err: any) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

  private getDriverVehicles(driverId?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.vehiclesService.getAllByUserId(driverId).subscribe({
        next: (val: any) => {
          this.vehicles = val.items;
          this.vehiclesForm = val.items;
          resolve();
        },
        error: (err: any) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

  private getAllAppointments(chargerId?: string, date?: string) {
    return new Promise<void>((resolve, reject) => {
      this.appointmentsService.all(chargerId, this.transformDate(date)).subscribe({
        next: (val: any) => {
          this.appointments = val.items;
          this.appointmentsForm = val.items;
          resolve();
        },
        error: (err: any) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

  transformDate(dateString?: string): string {
    return this.datePipe.transform(dateString, 'MM-dd-yyyy')!;
  }

  save() {
    if (this.form?.valid) {
      let model: ScheduleChargerSaveDto = {
        _id: undefined,
        driverId: this.user?._id,
        chargerId: this.chargerId,
        appointmentId: this.selectedAppointmentId,
        vehicleId: this.selectedVehicleId,
        date: this.transformDate(this.date)
      };

      this.scheduleChargersService.save(model).subscribe({
        next: (val: any) => {
          this.toastr.success("Schedule saved successfully!", "Success message", { timeOut: 5000 });
          this.cancel();
        },
        error: (err: any) => {
          this.toastr.error(err.message, "Error message", { timeOut: 5000 });
          this.errorMessages = err.message;
        }
      })
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  get date() {
    return this.form?.get('date')?.value;
  }

  set date(date: string) {
    this.form?.get('date')?.setValue(date);
  }

  set appointmentsForm(appointments: AppointmentAllItemDto[]) {
    this.form?.get('appointments')?.setValue(appointments);
  }

  set vehiclesForm(vehicles: VehicleGetAllItemDto[]) {
    this.form?.get('vehicles')?.setValue(vehicles);
  }
}
