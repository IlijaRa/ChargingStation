import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { ChargingHistoryGetAllDto, ChargingHistoryGetByIdDto, ChargingHistorySaveDto } from ".";

@Injectable()
export class ChargingHistoriesService {
    constructor(private http: HttpClient) { }

    save(model: ChargingHistorySaveDto): Observable<any> {
        return this.http.post(`${environment.apiUrl}/charging-histories/save`, model);
    }

    getById(id?: string): Observable<ChargingHistoryGetByIdDto> {
        return this.http.get(`${environment.apiUrl}/charging-histories/getbyid/${id}`);
    }

    getAll(chargerId?: string): Observable<ChargingHistoryGetAllDto> {
        return this.http.get<ChargingHistoryGetAllDto>(`${environment.apiUrl}/charging-histories/getall/${chargerId}`);
    }
}