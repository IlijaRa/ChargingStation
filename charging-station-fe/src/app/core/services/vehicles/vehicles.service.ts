import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom, Observable } from "rxjs";
import { VehicleGetAllDto, VehicleGetByIdDto, VehicleSaveDto } from "./vehicles.model";

@Injectable()
export class VehiclesService {
    constructor(private http: HttpClient) { }

    save(model: VehicleSaveDto): Observable<any> {
        return this.http.post(`${environment.apiUrl}/vehicles/save`, model);
    }

    getById(id?: string): Observable<VehicleGetByIdDto> {
        return this.http.get(`${environment.apiUrl}/vehicles/getbyid/${id}`);
    }

    async getAllByUserId(userId?: string): Promise<VehicleGetAllDto> {
        return await lastValueFrom<VehicleGetAllDto>(this.http.get<VehicleGetAllDto>(`${environment.apiUrl}/vehicles/getall/${userId}`));
    }

    async getAll(): Promise<VehicleGetAllDto> {
        return await lastValueFrom<VehicleGetAllDto>(this.http.get<VehicleGetAllDto>(`${environment.apiUrl}/vehicles/getall`));
    }

    async delete(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/vehicles/delete/${id}`));
    }
}