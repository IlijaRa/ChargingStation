import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { ChargerGetAllItemDto, ChargersService, IAddressResult, IResult, MapsService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import * as polyline from '@mapbox/polyline';
import * as turf from '@turf/turf';
import axios from 'axios';

@Component({
  selector: 'app-schedule-charger',
  templateUrl: './schedule-charger.component.html',
  styleUrls: ['./schedule-charger.component.css']
})
export class ScheduleChargerComponent implements OnInit {
  map?: mapboxgl.Map;

  start = [20.489303, 44.769119]; // Example end point [lng, lat]

  locations = [
    [19.843052026055503, 45.245440118008624],
    [19.845691243453228, 45.24486155343936],
    [19.921945498179802, 45.277814482817455]
  ]; // Example start point [lng, lat]

  settingsForm?: FormGroup;
  isReadyToMap: boolean = false;
  chargers?: ChargerGetAllItemDto[] = [];

  mapboxAddressResults?: IResult[];
  addresses: IAddressResult[] = [];
  selectedAddress?: string;
  latitude: number = 90;
  longitude: number = 90;

  constructor(
    private mapsService: MapsService,
    private chargersService: ChargersService,
    private formBuilder: FormBuilder) 
  { 
    this.settingsForm = this.formBuilder.group({
      driverLocation: new FormControl('')
    });
  }
  
  ngOnInit(): void {
    this.getAllChargers().subscribe((response: boolean) => {
      if (response){
        this.isReadyToMap = true;
      }
    });
  }

  async modifyMap(map: mapboxgl.Map) {
    if (!map) {
      return;
    }

    this.map = map;
    this.addGeocoderToMap();
    setTimeout(() => {
      this.getRoutes();
    }, 1000)
  }

  addGeocoderToMap() {
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapKey,
      mapboxgl: mapboxgl
    });

    document.getElementById('location-searcher')?.appendChild(geocoder.onAdd(this.map!));
  }

  private getRoutes() {
  const routePromises = this.locations.map(location => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.start[0]},${this.start[1]};${location[0]},${location[1]}?geometries=geojson&overview=full&steps=true&access_token=${environment.mapKey}`;
    return axios.get(url);
  });

  axios.all(routePromises)
    .then(axios.spread((...responses) => {
      const routes = responses.map(response => response.data.routes[0]);
      let shortestRoute = routes[0];

      // Find the shortest route
      routes.forEach(route => {
        if (route.distance < shortestRoute.distance) {
          shortestRoute = route;
        }
      });

      routes.forEach((route, index) => {
        const color = route === shortestRoute ? '#FF4786' : '#3F51B5';
        const isShortestRoute = route === shortestRoute;
        this.map!.addLayer({
          id: `route-${index}`,
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': 7,
            'line-opacity': 0.75,
            'line-dasharray': isShortestRoute ? [1, 0] : [2, 4]
          }
        });

        // Add a marker at the end of each route
        const marker = new mapboxgl.Marker({ color: '#3F51B5' });
        marker.setLngLat([this.locations[index][0], this.locations[index][1]])
        marker.addTo(this.map!);

        const popupContent = this.addInfoPopupToMap(route, index);
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
        marker.setPopup(popup);
      });

      const startLocationMarker = new mapboxgl.Marker({ color: '#FF4786' });
      startLocationMarker.setLngLat([this.start[0], this.start[1]])
      startLocationMarker.addTo(this.map!);
    }))
    .catch(error => {
      console.error('Error fetching directions:', error);
    });
}


  getAllChargers(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.chargersService?.getAll().subscribe({
        next: (val: any) => {
          this.chargers = val.items;
          observer.next(true);
          observer.complete();
        },
        error: (err: any) => {
          console.error(err);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  search(event?: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm && searchTerm.length > 0) {
      this.mapsService.searchAddress(searchTerm)?.subscribe((features: IResult[]) => {
        this.addresses = features.map(result => ({
          id: result.id,
          name: result.properties?.full_address || '',
          latitude: result.geometry?.coordinates ? result.geometry.coordinates[1] : 90,
          longitude: result.geometry?.coordinates ? result.geometry.coordinates[0] : 90,
        }));
        console.log("addresses", this.addresses);
        this.mapboxAddressResults = features;
      });
    } else {
      this.addresses = [];
    }
  }

  onSelect(address: IAddressResult) {
    this.selectedAddress = address.name;
    this.latitude = address.latitude!;
    this.longitude = address.longitude!;
    this.addresses = [];
  }

  addInfoPopupToMap(route?: any, index?: number) {
    const locationName = this.chargers?.find(x => x.latitude == route)

    return `
  <div style="
    font-family: Arial, sans-serif; 
    padding: 10px; 
    border-radius: 8px; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  ">
    <h3 style="
      font-size: 18px; 
      margin-bottom: 10px; 
      color: #333;
    ">Route Information</h3>
    <p style="
      margin: 5px 0; 
      font-size: 14px; 
      color: #555;
    ">Location: ${locationName}</p>
    <p style="
      margin: 5px 0; 
      font-size: 14px; 
      color: #555;
    ">Distance: ${(route.distance / 1000).toFixed(2)} km</p>
    <p style="
      margin: 5px 0; 
      font-size: 14px; 
      color: #555;
    ">Duration: ${(route.duration / 60).toFixed(2)} minutes</p>
    <button style="
      width: 100%; 
      background-color: #3F51B5; 
      color: white; 
      border: none; 
      padding: 8px 16px; 
      border-radius: 4px; 
      cursor: pointer;
    " 
    onclick="document.dispatchEvent(new CustomEvent('openForm', { detail: ${index} }))">
      Open Form
    </button>
  </div>
`;
  }

  // Create the popup
  // const popupContent = `
  //   <div>
  //     <h3>Route Information</h3>
  //     <p>Distance: ${(route.distance / 1000).toFixed(2)} km</p>
  //     <p>Duration: ${(route.duration / 60).toFixed(2)} minutes</p>
  //     <button onclick="document.dispatchEvent(new CustomEvent('openForm', { detail: ${index} }))">Open Form</button>
  //     <h4>Steps:</h4>
  //     <ul>${route.legs[0].steps.map((step: any) => `<li>${step.maneuver.instruction}</li>`).join('')}</ul>
  //   </div>
  // `;
} 
