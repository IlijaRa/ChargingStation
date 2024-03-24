import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom } from "rxjs";
import { ChargerGetAllDto, ChargerGetByIdDto } from "./chargers.model";

@Injectable()
export class ChargersService {
    constructor(private http: HttpClient) { }

    async getById(id?: string): Promise<ChargerGetByIdDto> {
        return await lastValueFrom<ChargerGetByIdDto>(this.http.get<ChargerGetByIdDto>(`${environment.apiUrl}/chargers/getbyid/${id}`));
    }

    async getAll(): Promise<any> {
        return await lastValueFrom<ChargerGetAllDto>(this.http.get<ChargerGetAllDto>(`${environment.apiUrl}/chargers/getall`));
    }
}