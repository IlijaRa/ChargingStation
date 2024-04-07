import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Auth, ErrorModel, ViewState } from "src/app/core";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    errorMessages?: string[];
    form?: FormGroup;
    viewState = ViewState;
    state?: ViewState;

    constructor(
        private router: Router, 
        private formBuilder: FormBuilder) 
    {
        this.form = this.formBuilder.group({
            usernameOrEmail: new FormControl(),
            password: new FormControl(),
        });
    }

    ngOnInit(): void { }

    login() {
        this.errorMessages = undefined;

        if (this.form?.valid) {
            let username = this.form?.value.usernameOrEmail;
            let password = this.form?.value.password;

            Auth.signOut();
            Auth.authenticate(username, password).then(() => {
                this.router.navigate(['/']);
            }).catch((e: ErrorModel) => {
                this.errorMessages = e.Messages;
            })
        }
    }
}