import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserGetAllItemDto, UsersService, ViewState } from "src/app/core";
import { UnconfirmedUserDetailComponent } from ".";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConfirmActionDialogComponent } from "src/app/core/common/confirm-action-dialog";

@Component({
    selector: 'unconfirmed-users',
    templateUrl: './unconfirmed-users.component.html',
    styleUrls: ['./unconfirmed-users.component.css']
})
export class UnconfirmedUsersComponent implements OnInit {
    form?: FormGroup;
    users?: UserGetAllItemDto[];
    displayedColumns: string[] = ['firstName', 'lastName', 'username', 'biography', 'gender', 'isConfirmed', 'id'];
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

    search() {
        this.usersService.searchUnconfirmed(this.querySearch ?? "").subscribe({
            next: (val: any) => {
                this.users = val.items;
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    confirmUser(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.confirm(userId).then((response: void) => {
                this.search();
                resolve();
            })
        });
    }

    deleteUser(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.delete(userId).then((response: void) => {
                this.search();
                resolve();
            })
        });
    }

    openDialog(id?: string, viewState?: ViewState) {
        console.log("id", id);
        console.log("viewState", viewState);
        this.matDialog.open(UnconfirmedUserDetailComponent, {
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

    openConfirmDialog(id?: string) {
        this.matDialog.open(ConfirmActionDialogComponent, {
            autoFocus: false,
            data: {
                actionName: 'Confirm',
                entityName: 'user'
            },
            width: '427px',
            height: '215px'
        })
        .afterClosed()
        .subscribe((res) => {
            if (res === 'ok') {
                this.confirmUser(id).then(() => {})
            }
            this.search();
        });
    }
}