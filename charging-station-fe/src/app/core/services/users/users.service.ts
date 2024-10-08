import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom, Observable } from "rxjs";
import { UserGetAllDto, UserGetByIdDto, UserSearchDto, UserUpdateDto } from "./users.model";

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) { }
    
    update(model: UserUpdateDto): Observable<any> {
        return this.http.put(`${environment.apiUrl}/users/update`, model);
    }
    
    async confirm(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.get<void>(`${environment.apiUrl}/users/confirm/${id}`));
    }

    async block(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.get<void>(`${environment.apiUrl}/users/block/${id}`));
    }

    async unblock(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.get<void>(`${environment.apiUrl}/users/unblock/${id}`));
    }

    getById(id?: string): Observable<UserGetByIdDto> {
        return this.http.get(`${environment.apiUrl}/users/getbyid/${id}`);
    }

    async getAll(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getall`));
    }

    async all(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/all`));
    }

    async getAllConfirmed(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallconfirmed`));
    }

    searchConfirmed(query?: string): Observable<UserSearchDto> {
        return this.http.get(`${environment.apiUrl}/users/searchConfirmed/${query}`);
    }

    async getAllUnconfirmed(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallunconfirmed`));
    }

    searchUnconfirmed(query?: string): Observable<UserSearchDto> {
        return this.http.get(`${environment.apiUrl}/users/searchUnconfirmed/${query}`);
    }

    async getAllBlocked(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallblocked`));
    }

    async getAllUnblocked(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallunblocked`));
    }

    async delete(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/users/delete/${id}`));
    }
}