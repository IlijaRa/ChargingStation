import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthsService, RegistrationDto, UserGetByIdDto, UsersService, UserUpdateDto, ViewState } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';

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
  errorMessages: any = undefined;
  
  constructor(
    private formBuilder: FormBuilder, 
    private authsService: AuthsService, 
    private usersService: UsersService, 
    private toastr: ToastrService,
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
              lastName: new FormControl(this.lastName, [Validators.required]),
              date: new FormControl(val?.dateOfBirth, [Validators.required]),
              biography: new FormControl(val?.biography, [Validators.required]),
              username: new FormControl(val?.username, [Validators.required]),
              emailAddress: new FormControl(val?.emailAddress, [Validators.required, Validators.email]),
              gender: new FormControl(val?.gender, [Validators.required]),
            });
          },
          error: (err: any) => {
            console.error(err);
          }
        })
      } else {
        this.form = this.formBuilder.group({
          firstName: new FormControl(''), 
          lastName: new FormControl('', [Validators.required]), 
          date: new FormControl('', [Validators.required]), 
          biography: new FormControl('', [Validators.required]), 
          username: new FormControl('', [Validators.required]), 
          emailAddress: new FormControl('', [Validators.required]), 
          password: new FormControl('', [Validators.required]), 
          gender: new FormControl('', [Validators.required]), 
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
          this.toastr.success("User saved successfully!", "Success message", { timeOut: 5000 });
          this.cancel();
        },
        error: (err: any) => {
          this.toastr.error(err.message, "Error message", { timeOut: 5000 });
          this.errorMessages = err.message;
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
          this.toastr.success("User updated successfully!", "Success message", { timeOut: 5000 });
          this.cancel();
        },
        error: (err: any) => {
          this.toastr.error(err.message, "Error message", { timeOut: 5000 });
          console.error(err);
        }
      })
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
