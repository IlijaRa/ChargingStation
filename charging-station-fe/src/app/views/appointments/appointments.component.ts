import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AppointmentGetAllDto, AppointmentGetAllItemDto, AppointmentsService, ChargersService, ViewState } from "src/app/core";
import { AppointmentAddComponent } from ".";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
    appointments?: AppointmentGetAllItemDto[];
    chargerLocation?: string;
    displayedColumns: string[] = ['startTime', 'endTime', 'isAvailable', 'isAllowed'];
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    chargerId?: string;

    pageEvent?: PageEvent;
    dataSource: any;
    pageSize: number = 7;
    currentPage: number = 0;
    totalSize: number = 0;

    @ViewChild(MatPaginator) paginator?: MatPaginator;
    
    constructor(
        private appointmentsService: AppointmentsService, 
        private chargersService: ChargersService,
        private route: ActivatedRoute, 
        private matDialog: MatDialog,
        private toastr: ToastrService
        ) {}

    ngOnInit(): void {
        this.route.params.subscribe((value: any) => {
            this.chargerId = value.id;
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
        this.appointmentsService.getAll(this.chargerId).subscribe({
            next: (val: any) => {
                this.appointments = val.items;
                this.dataSource = new MatTableDataSource<AppointmentGetAllDto>(val.items);
                this.dataSource.paginator = this.paginator;
                this.totalSize = this.appointments?.length!;
                this.iterator();
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    handlePageEvent(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
        this.iterator();
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.appointments?.slice(start, end);
        this.dataSource = part;
    }

    deleteAppointment(appointmentId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.appointmentsService.delete(appointmentId).then((response: void) => {
                this.toastr.success("Appointment deleted successfully!", "Success message", { timeOut: 5000 });
                this.getAll();
                resolve();
            })
        });
    }

    openDialog(id?: string) {
        this.matDialog.open(AppointmentAddComponent, {
            autoFocus: false,
            data: {
                id: id,
                chargerId: this.chargerId
            },
            width: '427px',
            height: '400px'
        })
        .afterClosed()
        .subscribe((res) => {
          this.getAll();
        });
    }

    toggleChangeEvent(e?: any, toggleState?: boolean) {
        e.source.checked = toggleState;
    }

    chaneAllowanceStatus(appointmentId?: string, chargerId?: string, isAllowed?: boolean) {
        this.openAllowanceStatusDialog(appointmentId, chargerId, isAllowed ? 'Unallow' : 'Allow');
    }

    private unallow(appointmentId?: string, chargerId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.appointmentsService.unallow(appointmentId, chargerId).then((response: void) => {
                this.toastr.success("Appointment unallowed successfully!", "Success message", { timeOut: 5000 });
                this.getAll();
                resolve();
            })
        });
    }

    private allow(appointmentId?: string, chargerId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.appointmentsService.allow(appointmentId, chargerId).then((response: void) => {
                this.toastr.success("Appointment allowed successfully!", "Success message", { timeOut: 5000 });
                this.getAll();
                resolve();
            })
        });
    }

    openAllowanceStatusDialog(appointmentId?: string, chargerId?: string ,actionName?: string) {
        this.matDialog.open(ConfirmActionDialogComponent, {
            autoFocus: false,
            data: {
                actionName: actionName,
                entityName: 'appointment'
            },
            width: '427px',
            height: '215px'
        })
        .afterClosed()
        .subscribe((res) => {
            if (res === 'yes') {
                if (actionName === 'Allow') {
                    this.allow(appointmentId, chargerId);
                } else {
                    this.unallow(appointmentId, chargerId);
                } 
            }
            
            this.getAll();
        });
    }
}