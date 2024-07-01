import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserGetAllItemDto, UsersService, ViewState } from "src/app/core";
import { UserAddEditComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    form?: FormGroup;
    users?: UserGetAllItemDto[];
    displayedColumns: string[] = ['firstName', 'lastName', 'username', 'biography', 'gender', 'isBlocked', 'isConfirmed', 'id'];
    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    querySearch?: string = undefined;

    pageEvent?: PageEvent;
    dataSource: any;
    pageSize: number = 7;
    currentPage: number = 0;
    totalSize: number = 0;

    @ViewChild(MatPaginator) paginator?: MatPaginator;

    constructor(
        private formBuilder: FormBuilder, 
        private usersService: UsersService, 
        private toastr: ToastrService,
        private matDialog: MatDialog) 
    {
        this.form = this.formBuilder.group({
            query: new FormControl(this.querySearch),
        });
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
        this.usersService.searchConfirmed(this.querySearch ?? "").subscribe({
            next: (val: any) => {
                this.users = val.items;
                this.dataSource = new MatTableDataSource<UserGetAllItemDto>(val.items);
                this.dataSource.paginator = this.paginator;
                this.totalSize = this.users?.length!;
                this.iterator();
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    clearSearch() {
        this.querySearch = undefined;
        this.search();
    }

    handlePageEvent(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
        this.iterator();
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.users?.slice(start, end);
        this.dataSource = part;
    }

    deleteUser(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.delete(userId).then((response: void) => {
                this.toastr.success("User deleted successfully!", "Success message", { timeOut: 5000 });
                this.search();
                resolve();
            })
        });
    }

    isConfirmedChange(e?: any) {
        e.source.checked = true;
    }

    openDialog(id?: string, viewState?: ViewState) {
        console.log("id", id);
        console.log("viewState", viewState);
        this.matDialog.open(UserAddEditComponent, {
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
          this.search();
        });
    }

    openDeleteDialog(id?: string) {
        this.matDialog.open(ConfirmActionDialogComponent, {
            autoFocus: false,
            data: {
                actionName: 'Delete',
                entityName: 'user'
            },
            width: '427px',
            height: '215px'
        })
        .afterClosed()
        .subscribe((res) => {
            if (res === 'yes') {
                this.deleteUser(id).then(() => {
                    this.search();
                })
            }
        });
    }

    changeBlockStatus(userId?: string, isBlocked?: boolean) {
        this.openBlockStatusDialog(userId, isBlocked ? 'Unblock' : 'Block');
    }

    private unblock(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.unblock(userId).then((response: void) => {
                this.toastr.success("User unblocked successfully!", "Success message", { timeOut: 5000 });
                this.search();
                resolve();
            })
        });
    }

    private block(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.block(userId).then((response: void) => {
                this.toastr.success("User blocked successfully!", "Success message", { timeOut: 5000 });
                this.search();
                resolve();
            })
        });
    }

    openBlockStatusDialog(id?: string, actionName?: string) {
        this.matDialog.open(ConfirmActionDialogComponent, {
            autoFocus: false,
            data: {
                actionName: actionName,
                entityName: 'user'
            },
            width: '427px',
            height: '215px'
        })
        .afterClosed()
        .subscribe((res) => {
            if (res === 'yes') {
                if (actionName === 'Block') {
                    this.block(id);
                } else {
                    this.unblock(id);
                } 
            }
            
            this.search();
        });
    }
}