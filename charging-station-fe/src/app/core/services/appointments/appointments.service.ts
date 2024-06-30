import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom, Observable } from "rxjs";
import { AppointmentAllDto, AppointmentAllowDto, AppointmentGetAllDto, AppointmentGetByIdDto, AppointmentSaveDto } from "./appointments.model";

@Injectable()
export class AppointmentsService {
    constructor(private http: HttpClient) { }

    save(model: AppointmentSaveDto): Observable<any> {
        return this.http.post(`${environment.apiUrl}/appointments/save`, model);
    }

    async allow(appointmentId?: string, chargerId?: string): Promise<any> {
        let model: AppointmentAllowDto = { appointmentId: appointmentId, chargerId: chargerId }
        return await lastValueFrom<void>(this.http.post<void>(`${environment.apiUrl}/appointments/allow`, model));
    }

    async unallow(appointmentId?: string, chargerId?: string): Promise<any> {
        let model: AppointmentAllowDto = { appointmentId: appointmentId, chargerId: chargerId }
        return await lastValueFrom<void>(this.http.post<void>(`${environment.apiUrl}/appointments/unallow`, model));
    }

    getById(id?: string): Observable<AppointmentGetByIdDto> {
        return this.http.get(`${environment.apiUrl}/appointments/getbyid/${id}`);
    }

    getAll(chargerId?: string): Observable<AppointmentGetAllDto> {
        return this.http.get<AppointmentGetAllDto>(`${environment.apiUrl}/appointments/getall/${chargerId}`);
    }

    all(chargerId?: string, date?: string): Observable<AppointmentAllDto> {
        return this.http.get<AppointmentAllDto>(`${environment.apiUrl}/appointments/all/${chargerId}/${date}`);
    }

    async delete(id?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.delete<void>(`${environment.apiUrl}/appointments/delete/${id}`));
    }
}