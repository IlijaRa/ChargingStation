import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { CurrentUserDto } from "./accounts.model";

@Injectable()
export class AccountsService {
    constructor(private http: HttpClient) { }

    getCurrentUser(): Observable<CurrentUserDto> {
        return this.http.get(`${environment.apiUrl}/accounts/getcurrentuser`);
    }
}