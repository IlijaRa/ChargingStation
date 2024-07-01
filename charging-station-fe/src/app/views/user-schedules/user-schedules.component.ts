import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AccountsService, CurrentUserDto, ScheduleChargerSearchItemDto, ScheduleChargersService } from 'src/app/core';
import { ConfirmActionDialogComponent } from 'src/app/core/common/confirm-action-dialog';

@Component({
  selector: 'app-user-schedules',
  templateUrl: './user-schedules.component.html',
  styleUrls: ['./user-schedules.component.css']
})
export class UserSchedulesComponent {
  form?: FormGroup;
  scheduleChargings?: ScheduleChargerSearchItemDto[];
  displayedColumns: string[] = ['driverName', 'location', 'date', 'startTime', 'endTime', 'vehicleModel', '_id'];
  entityModalShow: boolean = false;
  entityId?: string;
  selectedItem: any;
  querySearch?: string = undefined;
  user?: CurrentUserDto;
  
  pageEvent?: PageEvent;
  dataSource: any;
  pageSize: number = 7;
  currentPage: number = 0;
  totalSize: number = 0;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
      private formBuilder: FormBuilder, 
      private scheduleChargersService: ScheduleChargersService, 
      private accountsService: AccountsService, 
      private router: Router,
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
            return this.scheduleChargersService.searchByDriver(this.querySearch ?? "", this.user?._id ?? "");
        })
    ).subscribe({
        next: (val: any) => {
            this.scheduleChargings = val.items;
            this.dataSource = new MatTableDataSource<ScheduleChargerSearchItemDto>(val.items);
            this.dataSource.paginator = this.paginator;
            this.totalSize = this.scheduleChargings?.length!;
            this.iterator();
        },
        error: (err: any) => {
            console.error(err);
        }
    });
  }

  search(userId?: string) {
      this.scheduleChargersService.searchByDriver(this.querySearch ?? "", userId ?? "").subscribe({
          next: (val: any) => {
              this.scheduleChargings = val.items;
              this.dataSource = new MatTableDataSource<ScheduleChargerSearchItemDto>(val.items);
              this.dataSource.paginator = this.paginator;
              this.totalSize = this.scheduleChargings?.length!;
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
      const part = this.scheduleChargings?.slice(start, end);
      this.dataSource = part;
  }

  finishSchedule(scheduleChargerId?: string): Promise<void> {
      return new Promise((resolve: any) => {
          this.scheduleChargersService.finishSchedule(scheduleChargerId).then((response: void) => {
              this.search(this.user?._id);
              resolve();
          })
      });
  }

  navigateTo(page?: string) {
    this.router.navigate([`/${page}`]);
  }

  openFinishDialog(id?: string) {
      this.matDialog.open(ConfirmActionDialogComponent, {
          autoFocus: false,
          data: {
          actionName: 'Finish',
          entityName: 'schedule'
          },
          width: '427px',
          height: '215px'
      })
      .afterClosed()
      .subscribe((res) => {
          if (res === 'yes') {
              this.finishSchedule(id).then(() => {
                  this.search(this.user?._id);
              })
          }
      });
  }
}
