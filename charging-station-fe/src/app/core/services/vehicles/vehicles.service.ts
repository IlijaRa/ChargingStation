import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom } from "rxjs";
import { VehicleGetAllDto, VehicleGetByIdDto } from "./vehicles.model";

@Injectable()
export class VehiclesService {
    constructor(private http: HttpClient) { }

    async getById(id?: string): Promise<VehicleGetByIdDto> {
        return await lastValueFrom<VehicleGetByIdDto>(this.http.get<VehicleGetByIdDto>(`${environment.apiUrl}/vehicles/getbyid/${id}`));
    }

    async getAllByUserId(userId?: string): Promise<VehicleGetAllDto> {
        return await lastValueFrom<VehicleGetAllDto>(this.http.get<VehicleGetAllDto>(`${environment.apiUrl}/vehicles/getall/${userId}`));
    }

    async getAll(): Promise<VehicleGetAllDto> {
        return await lastValueFrom<VehicleGetAllDto>(this.http.get<VehicleGetAllDto>(`${environment.apiUrl}/vehicles/getall`));
    }
}