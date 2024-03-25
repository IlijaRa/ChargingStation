import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom } from "rxjs";
import { UserGetAllDto, UserGetByIdDto } from "./users.model";

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) { }

    async confirm(id?: number): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/users/confirm/${id}`));
    }

    async block(id?: number): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/users/block/${id}`));
    }

    async unblock(id?: number): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/users/unblock/${id}`));
    }

    async getById(id?: string): Promise<UserGetByIdDto> {
        return await lastValueFrom<UserGetByIdDto>(this.http.get<UserGetByIdDto>(`${environment.apiUrl}/users/confirm/${id}`));
    }

    async getAll(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getall`));
    }

    async getAllConfirmed(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallconfirmed`));
    }

    async getAllUnconfirmed(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallunconfirmed`));
    }

    async getAllBlocked(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallblocked`));
    }

    async getAllUnblocked(): Promise<any> {
        return await lastValueFrom<UserGetAllDto>(this.http.get<UserGetAllDto>(`${environment.apiUrl}/users/getallunblocked`));
    }
}