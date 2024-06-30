import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class MapsService {
    constructor(private http?: HttpClient) { }

    // source: https://docs.mapbox.com/api/search/geocoding/
    // "https://api.mapbox.com/search/geocode/v6/forward?q=Los%20Angeles&access_token=YOUR_MAPBOX_ACCESS_TOKEN";
    searchAddress(query?: string) {
        query = query?.trim().replace(' ', '%');
        return this.http?.get(`https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${environment.mapKey}`).pipe(
            map((res: any) => {
                return res.features;
            })
        );
    }

    // source: https://docs.mapbox.com/api/navigation/directions/
    // "https://api.mapbox.com/directions/v5/{profile}/{coordinates}"
    getDirections () {
        `https://api.mapbox.com/directions/v5/mapbox/driving/{coordinates}`;
    }

    // source: https://docs.mapbox.com/help/tutorials/optimization-api/
    // https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{coordinates};{coordinates};...?access_token=YOUR_MAPBOX_ACCESS_TOKEN
    async getOptimizedRoutes (coordinates: number[][]) {
        const coordinatesString = coordinates.map(coord => coord.join(',')).join(';');
        // return this.http?.get(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinatesString}?access_token=${environment.mapKey}`).pipe(
        //     map((res: any) => {
        //         return res;
        //     })
        // );

        return (await fetch(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinatesString}?access_token=${environment.mapKey}`, { 
            method: 'GET' 
        })).json();
    }
}