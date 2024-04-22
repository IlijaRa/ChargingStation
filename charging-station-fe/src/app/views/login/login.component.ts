import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Auth, ViewState } from "src/app/core";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form?: FormGroup;
    viewState = ViewState;
    state?: ViewState;
    errorMessage?: string;
    
    constructor(
        private router: Router, 
        private formBuilder: FormBuilder) 
    {
        this.form = this.formBuilder.group({
            usernameOrEmail: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void { }

    login() {
        this.errorMessage = undefined;

        if (this.form?.valid) {
            const username = this.form?.value.usernameOrEmail;
            const password = this.form?.value.password;
    
            Auth.signOut();
            Auth.authenticate(username, password).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err: any) => {
                    this.errorMessage = err.message;
                }
            });
        }
    }
}