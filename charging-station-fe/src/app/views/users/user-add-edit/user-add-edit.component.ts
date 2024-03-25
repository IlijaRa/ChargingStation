import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthsService, RegistrationDto } from 'src/app/core';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private authsService: AuthsService, private dialogRef: DialogRef<UserAddEditComponent>) {
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      date: '',
      biography: '',
      username: '',
      emailAddress: '',
      password: '',
      gender: ''
    });
  }

  save() {
    if (this.form.valid) {
      let model: RegistrationDto = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        dateOfBirth: this.form.value.date,
        biography: this.form.value.biography,
        username: this.form.value.username,
        emailAddress: this.form.value.emailAddress,
        password: this.form.value.password,
        role: "driver",
        gender: this.form.value.gender,
      };
      this.authsService.register(model).subscribe({
        next: (val: any) => {
          this.dialogRef.close();
          alert("Employee added successfully!");
        },
        error: (err: any) => {
          console.error(err);
        }
      })
    }
  }
}
