import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { lastValueFrom, Observable } from "rxjs";
import { ScheduleChargerSaveDto, ScheduleChargerSearchDto } from "./schedule-chargers.model";

@Injectable()
export class ScheduleChargersService {
    constructor(private http: HttpClient) { }

    save(model: ScheduleChargerSaveDto): Observable<any> {
        return this.http.post(`${environment.apiUrl}/schedule-charger/save`, model);
    }

    searchByDriver(query?: string, driverId?: string): Observable<ScheduleChargerSearchDto> {
        const params: any = {};
        params.driverId = driverId;
        return this.http.post(`${environment.apiUrl}/schedule-charger/search/${query}`, null, { params });
    }

    async finishSchedule(scheduleChargerId?: string): Promise<any> {
        return await lastValueFrom<void>(this.http.get<void>(`${environment.apiUrl}/schedule-charger/finish/${scheduleChargerId}`));
    }
}