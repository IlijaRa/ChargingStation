import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { AppInjector } from "../app-injector";
import { Dictionary, ErrorModel } from "../common";
import { AuthUser } from "./auth.model";

class AuthenticationRequest {
    username?: string;
    password?: string;
}

class AuthenticationResponse {
    access_token?: string;
    refresh_token?: string;
}

class CheckUsernameRequest{
    username?: string;
}

class CheckUsernameResponse{
    doesExist?: boolean;
}

class UserModel {
    firstName?: string;
    roles?: string[];
    lastName?: string;
}

export class Auth {

    static user?: AuthUser;
    static authorized: Dictionary = [];

    static setToken(token: string | undefined) {
        if (token) {
            sessionStorage.setItem('flow-token', token);
        } else {
            sessionStorage.removeItem('flow-token');
        }
    }

    static getToken(): string | null {
        return sessionStorage.getItem('flow-token');
    }

    static fetchUser(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.getToken()) {
                const headers = new HttpHeaders({'Authorization': `Bearer ${this.getToken()}`});

                lastValueFrom<UserModel>(this.getHttpClient().get<UserModel>(`${environment.apiUrl}/Account/GetUser`, { headers: headers })).then((response: UserModel) => {
                    this.user = undefined;
                    this.authorized = [];

                    if (response) {
                        this.user = new AuthUser();
                        this.user.firstName = response.firstName?.trim();
                        this.user.lastName = response.lastName?.trim();
                        this.user.initials = '';
                        this.user.initials += this.user?.firstName && this.user?.firstName.length > 0 ? this.user.firstName.substring(0, 1) : this.user.initials;
                        this.user.initials += this.user?.lastName && this.user?.lastName.length > 0 ? this.user.lastName.substring(0, 1) : this.user.initials;

                        if (response.roles) {
                            response.roles.forEach((value: string) => {
                                this.authorized[value] = true;
                            })
                        }
                    }
    
                    resolve();
                })
            } else {
                reject();
            }
        })
    }

    static authenticate(username: string, password: string): Promise<void> {
        return new Promise((resolve, reject) => {

            let model: AuthenticationRequest = new AuthenticationRequest();
            model.username = username;
            model.password = password;

            lastValueFrom<AuthenticationResponse>(this.getHttpClient().post<AuthenticationResponse>(`${environment.apiUrl}/auth/login`, model)).then((response: AuthenticationResponse) => {
                this.setToken(response?.access_token);
                this.fetchUser().then(() => {
                    resolve();
                })
            }).catch((e: ErrorModel) => {
                reject(e);
            })
        })
    }

    // static checkUsername(username: string): Promise<void> {
    //     return new Promise((resolve, reject) => {

    //         let model: CheckUsernameRequest = new CheckUsernameRequest();
    //         model.username = username;

    //         lastValueFrom<CheckUsernameResponse>(this.getHttpClient().post<CheckUsernameResponse>(`${environment.apiUrl}/Account/CheckUsername`, model)).then((response: CheckUsernameResponse) => {
    //             if (response.doesExist == true){
    //                 resolve();
    //             }
    //         }).catch((e: ErrorModel) => {
    //             reject(e);
    //         })
    //     })
    // }

    static signOut() {
        this.user = undefined;
        this.setToken(undefined);
    }

    private static getHttpClient() {
        return AppInjector.instance.get(HttpClient);
    }
}