import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { ScheduleChargerSaveDto } from "./schedule-chargers.model";

@Injectable()
export class ScheduleChargersService {
    constructor(private http: HttpClient) { }

    save(model: ScheduleChargerSaveDto): Observable<any> {
        return this.http.post(`${environment.apiUrl}/schedule-charger/save`, model);
    }
}