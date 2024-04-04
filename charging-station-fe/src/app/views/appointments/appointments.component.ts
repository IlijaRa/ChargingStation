import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AppointmentGetAllDto, AppointmentGetAllItemDto, AppointmentsService, ChargerGetByIdDto, ChargersService, ViewState } from "src/app/core";
import { AppointmentAddComponent } from ".";

@Component({
    selector: 'appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
    appointments?: AppointmentGetAllItemDto[];
    chargerLocation?: string;
    displayedColumns: string[] = ['startDate', 'endDate', 'isAvailable', 'id'];
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    chargerId?: string;

    constructor(
        private appointmentsService: AppointmentsService, 
        private chargersService: ChargersService,
        private route: ActivatedRoute, 
        private matDialog: MatDialog
        ) {}

    ngOnInit(): void {
        this.route.params.subscribe((value: any) => {
            this.chargerId = value.id;
            console.log("this.chargerId", this.chargerId);
            this.getCharger();
            this.getAll();
        })
    }

    getCharger() {
        this.chargersService.getById(this.chargerId).subscribe({
            next: (val: any) => {
                this.chargerLocation = val?.location;
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    getAll() {
        this.appointmentsService.getAll(this.chargerId).then((response: AppointmentGetAllDto) => {
            this.appointments = response.items;
            console.log("this.appointments", this.appointments);
            console.log("response.items", response.items);
        })
    }

    deleteAppointment(appointmentId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.appointmentsService.delete(appointmentId).then((response: void) => {
                this.getAll();
                resolve();
            })
        });
    }

    openDialog(id?: string, viewState?: ViewState) {
        this.matDialog.open(AppointmentAddComponent, {
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