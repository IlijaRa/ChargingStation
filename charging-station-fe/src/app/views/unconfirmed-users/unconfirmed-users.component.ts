import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserGetAllDto, UserGetAllItemDto, UsersService, ViewState } from "src/app/core";
import { } from ".";

@Component({
    selector: 'unconfirmed-users',
    templateUrl: './unconfirmed-users.component.html',
    styleUrls: ['./unconfirmed-users.component.css']
})
export class UnconfirmedUsersComponent implements OnInit {
    users?: UserGetAllItemDto[];
    displayedColumns: string[] = ['firstName', 'lastName', 'username', 'biography', 'gender', 'isConfirmed', 'id'];
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
            this.usersService.getAllUnconfirmed().then((response: UserGetAllDto) => {
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

    confirmUser(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.confirm(userId).then((response: void) => {
                this.getAll();
                resolve();
            })
        });
    }

    deleteUser(userId?: string): Promise<void> {
        return new Promise((resolve: any) => {
            this.usersService.delete(userId).then((response: void) => {
                this.getAll();
                resolve();
            })
        });
    }

    openUserDialog(id?: string, viewState?: ViewState) {
        // console.log("id", id);
        // console.log("viewState", viewState);
        // this.matDialog.open(UserAddEditComponent, {
        //     autoFocus: false,
        //     data: {
        //         id: id,
        //         state: viewState
        //     },
        //     width: '427px',
        //     height: '609px'
        // })
        // .afterClosed()
        // .subscribe((res) => {
        //   this.getAll();
        // //   setTimeout(() => {
        // //     if (viewState == ViewState.Create) {
        // //         alert("Employee added successfully!");
        // //     } 
            
        // //     if (viewState == ViewState.Edit) {
        // //         alert("Employee updated successfully!");
        // //     }
        // //   }, 500);
        // });
    }
}