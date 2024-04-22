import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthsService, RegistrationDto, ViewState } from "src/app/core";

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
    form?: FormGroup;
    viewState = ViewState;
    state?: ViewState;
    errorMessage?: string;
    
    constructor(
        private router: Router, 
        private formBuilder: FormBuilder,
        private authsService: AuthsService) 
    {
        this.form = this.formBuilder.group({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            dateOfBirth: new FormControl('', [Validators.required]),
            biography: new FormControl('', [Validators.required]),
            username: new FormControl('', [Validators.required]),
            emailAddress: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            gender: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
    }

    register() {
        this.errorMessage = undefined;

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
            },
            error: (err: any) => {
                this.errorMessage = err.message;
            }
          })
        }
      }
}