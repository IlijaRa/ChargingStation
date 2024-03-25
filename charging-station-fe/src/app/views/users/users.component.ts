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
    entityState: ViewState = ViewState.Details;
    entityId?: string;
        
    constructor(private usersService: UsersService, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.getAll();
    }

    entityDetails(id?: string) {
        this.entityModalShow = true;
        this.entityId = id;
        this.entityState = ViewState.Details;
    }

    entityModalClose() {
        this.entityModalShow = false;
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

    openAddEditUser() {
        this.matDialog.open(UserAddEditComponent);
    }
}