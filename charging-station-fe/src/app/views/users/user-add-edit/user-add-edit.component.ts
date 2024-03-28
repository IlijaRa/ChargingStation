import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthsService, RegistrationDto, UserGetByIdDto, UsersService, UserUpdateDto, ViewState } from 'src/app/core';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent {
  form?: FormGroup;
  user?: UserGetByIdDto;
  firstName?: string;
  viewState = ViewState;
  state?: ViewState;
  disabled?: boolean;

  private entityId: string;
  
  constructor(
    private formBuilder: FormBuilder, 
    private authsService: AuthsService, 
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
            this.disabled = this.state == this.viewState.Details;
            this.firstName = val?.firstName;
            this.form = this.formBuilder.group({
              firstName: new FormControl({ value : this.firstName, disabled: this.disabled }),
              lastName: new FormControl({ value : val?.lastName, disabled: this.disabled }),
              date: new FormControl({ value : val?.dateOfBirth, disabled: this.disabled }),
              biography: new FormControl({ value : val?.biography, disabled: this.disabled }),
              username: new FormControl({ value : val?.username, disabled: this.disabled }),
              emailAddress: new FormControl({ value : val?.emailAddress, disabled: this.disabled }),
              password: new FormControl({ value : val?.password, disabled: this.disabled }),
              gender: new FormControl({ value : val?.gender, disabled: this.disabled }),
              isBlocked: new FormControl({ value : val?.isBlocked == true ? "true" : "false", disabled: this.disabled }),
              isConfirmed: new FormControl({ value : val?.isConfirmed == true ? "true" : "false", disabled: this.disabled }),
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          firstName: '', lastName: '', date: '', biography: '', username: '', emailAddress: '', password: '', gender: ''
        });
      }
  }

  save() {
    if (this.form?.valid) {
      let model: RegistrationDto = {
        firstName: this.form?.value.firstName,
        lastName: this.form?.value.lastName,
        dateOfBirth: this.form?.value.date,
        biography: this.form?.value.biography,
        username: this.form?.value.username,
        emailAddress: this.form?.value.emailAddress,
        password: this.form?.value.password,
        role: "driver",
        gender: this.form?.value.gender,
      };
      this.authsService.register(model).subscribe({
        next: (val: any) => {
          this.cancel();
        },
        error: (err: any) => {
          console.error(err);
        }
      })
    }
  }

  update() {
    if (this.form?.valid) {
      let model: UserUpdateDto = {
        _id: this.entityId,
        firstName: this.form?.value.firstName,
        lastName: this.form?.value.lastName,
        dateOfBirth: this.form?.value.date,
        biography: this.form?.value.biography,
        username: this.form?.value.username,
        emailAddress: this.form?.value.emailAddress,
        password: this.form?.value.password,
        role: "driver",
        gender: this.form?.value.gender,
        isBlocked: this.form?.value.isBlocked == "true" ? true : false,
        isConfirmed: this.form?.value.isConfirmed == "true" ? true : false,
      };
      this.usersService.update(model).subscribe({
        next: (val: any) => {
          this.cancel();
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
