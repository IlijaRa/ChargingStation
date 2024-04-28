import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class MapsService {
    constructor(private http?: HttpClient) 
    {
        // resource: https://docs.mapbox.com/api/search/geocoding/
        // "https://api.mapbox.com/search/geocode/v6/forward?q=Los%20Angeles&access_token=YOUR_MAPBOX_ACCESS_TOKEN";
    }

    formatForwardGeocoding(address?: string){
        address = address?.trim().replace(' ', '%');
        return `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${environment.mapKey}`
    }

    searchAddress(query?: string) {
        return this.http?.get(this.formatForwardGeocoding(query)).pipe(
            map((res: any) => {
                return res.features;
            })
        );
    }
}