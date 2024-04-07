import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserGetAllItemDto, UsersService, ViewState } from "src/app/core";
import { UserAddEditComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";

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
    selectedItem: any;
    querySearch?: string = undefined;

    handleClick($event: any) {
      $event.stopPropagation();
    }
  
    select(item: any) {
      this.selectedItem = item;
    }

    constructor(private formBuilder: FormBuilder, private usersService: UsersService, private matDialog: MatDialog) 
    {
        this.form = this.formBuilder.group({
            query: new FormControl(this.querySearch),
        });
    }

    ngOnInit(): void {
        this.search();
    }

    entityActionCallback() {
    }

    search() {
        this.usersService.searchConfirmed(this.querySearch ?? "").subscribe({
            next: (val: any) => {
                this.users = val.items;
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    deleteUser(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.delete(userId).then((response: void) => {
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
            if (res === 'ok') {
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
                this.search();
                resolve();
            })
        });
    }

    private block(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.block(userId).then((response: void) => {
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
            if (res === 'ok') {
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