import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom, Observable } from "rxjs";
import { AppointmentGetAllDto, AppointmentGetByIdDto, AppointmentSaveDto } from "./appointments.model";

@Injectable()
export class AppointmentsService {
    constructor(private http: HttpClient) { }

    save(model: AppointmentSaveDto): Observable<any> {
        return this.http.put(`${environment.apiUrl}/appointments/save`, model);
    }

    getById(id?: string): Observable<AppointmentGetByIdDto> {
        return this.http.get(`${environment.apiUrl}/appointments/getbyid/${id}`);
    }

    async getAll(chargerId?: string): Promise<any> {
        return await lastValueFrom<AppointmentGetAllDto>(this.http.get<AppointmentGetAllDto>(`${environment.apiUrl}/appointments/getall/${chargerId}`));
    }

    async delete(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/appointments/delete/${id}`));
    }
}