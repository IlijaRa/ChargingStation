import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { ChargerGetAllItemDto, ChargersService, IAddressResult, IResult, MapsService } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-schedule-charger',
  templateUrl: './schedule-charger.component.html',
  styleUrls: ['./schedule-charger.component.css']
})
export class ScheduleChargerComponent implements OnInit {
  
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
        console.log("chargers", this.chargers);
      }
    });
  }

  addOptionsToMap(map: mapboxgl.Map) {
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapKey,
      mapboxgl: mapboxgl
    });

    document.getElementById('location-searcher')?.appendChild(geocoder.onAdd(map));

    const coordinates = [
      [19.8335, 45.2671], // Novi Sad
      [20.457273, 44.787197]  // Belgrade
    ];

    map.on('load', () => {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 8
        }
      });
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

} 
