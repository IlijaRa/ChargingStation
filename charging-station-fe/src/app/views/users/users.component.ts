import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UserGetAllDto, UserGetAllItemDto, UsersService, ViewState } from "src/app/core";
import { UserAddEditComponent } from ".";

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    users?: UserGetAllItemDto[];
    displayedColumns: string[] = ['firstName', 'lastName', 'username', 'biography', 'gender', 'isBlocked', 'isConfirmed', 'id'];
    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;
    selectedItem: any;
    handleClick($event: any) {
      $event.stopPropagation();
    }
  
    select(item: any) {
      this.selectedItem = item;
    }

    constructor(private usersService: UsersService, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.getAll();
    }

    entityActionCallback() {
    }

    private getAll(): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.getAllConfirmed().then((response: UserGetAllDto) => {
                this.users = response.items;
                this.users?.forEach(user => {
                    if (user.biography) {
                        user.biography = this.cropBiography(user.biography);
                    }
                });
                resolve();
            })
        });
    }

    private cropBiography(biography?: string) {
        const periodIndex = biography?.indexOf('.');
        if (periodIndex !== -1) {
            return biography?.substring(0, periodIndex! + 1);
        }
        return biography;
    }

    changeBlockStatus(userId?: string, isBlocked?: boolean) {
        if (isBlocked) {
            this.unblock(userId);
        } else {
            this.block(userId);
        }
    }

    private unblock(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.unblock(userId).then((response: void) => {
                this.getAll();
                resolve();
            })
        });
    }

    private block(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.block(userId).then((response: void) => {
                this.getAll();
                resolve();
            })
        });
    }

    isConfirmedChange(e?: any) {
        e.source.checked = true;
    }

    openUserDialog(id?: string, viewState?: ViewState) {
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