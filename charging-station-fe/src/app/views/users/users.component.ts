import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UserGetAllDto, UserGetAllItemDto, UsersService, ViewState } from "src/app/core";
import { UserAddEditComponent } from ".";

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
    users?: UserGetAllItemDto[];

    entityModalShow: boolean = false;
    viewState = ViewState;
    entityState: ViewState = ViewState.Details;
    entityId?: string;

    constructor(private usersService: UsersService, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.getAll();
    }

    entityActionCallback() {
    }

    private getAll(): Promise<void> {
        return new Promise((resolve: any) => {
          this.usersService.getAll().then((response: UserGetAllDto) => {
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

    openUserDialog(id?: string, viewState?: ViewState) {
        this.matDialog.open(UserAddEditComponent, {
            autoFocus: false,
            data: {
                id: id,
                state: viewState
            }
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