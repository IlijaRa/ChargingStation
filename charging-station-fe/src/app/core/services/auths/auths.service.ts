import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom, Observable } from "rxjs";
import { RegistrationDto } from "../auths";

@Injectable()
export class AuthsService {
    constructor(private http: HttpClient) { }

    register(model: RegistrationDto): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auth/register`, model);
    }
}