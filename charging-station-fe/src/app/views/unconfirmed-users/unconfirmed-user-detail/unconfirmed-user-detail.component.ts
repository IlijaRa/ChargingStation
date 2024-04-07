import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserGetByIdDto, UsersService, ViewState } from 'src/app/core';
import { UserAddEditComponent } from '../../users';

@Component({
  selector: 'app-unconfirmed-user-detail',
  templateUrl: './unconfirmed-user-detail.component.html',
  styleUrls: ['./unconfirmed-user-detail.component.css']
})
export class UnconfirmedUserDetailComponent {
  form?: FormGroup;
  user?: UserGetByIdDto;
  firstName?: string;
  lastName?: string;
  viewState = ViewState;
  state?: ViewState;
  disabled?: boolean;
  entityId: string;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService, 
    private dialogRef: DialogRef<UserAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { id: string, state?: ViewState }) 
    {
      this.entityId = data.id;
      this.state = data.state;
      if (this.entityId) {
        this.usersService.getById(this.entityId).subscribe({
          next: (val: any) => {
            this.user = val;
            this.firstName = val?.firstName;
            this.lastName = val?.lastName;
            this.form = this.formBuilder.group({
              firstName: new FormControl(this.firstName),
              lastName: new FormControl(this.lastName),
              date: new FormControl(val?.dateOfBirth),
              biography: new FormControl(val?.biography),
              username: new FormControl(val?.username),
              emailAddress: new FormControl(val?.emailAddress),
              password: new FormControl(val?.password),
              gender: new FormControl(val?.gender),
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      }
    }

    cancel() {
      this.dialogRef.close();
    }
}
