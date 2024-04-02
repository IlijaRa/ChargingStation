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
  lastName?: string;
  viewState = ViewState;
  state?: ViewState;
  disabled?: boolean;
  entityId: string;
  
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
        role: "driver",
        gender: this.form?.value.gender
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
