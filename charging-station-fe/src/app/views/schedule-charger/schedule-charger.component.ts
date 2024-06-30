import { Component, OnInit } from '@angular/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { ChargerGetAllItemDto, ChargersService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import axios from 'axios';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleChargerAddComponent } from '.';

@Component({
  selector: 'app-schedule-charger',
  templateUrl: './schedule-charger.component.html',
  styleUrls: ['./schedule-charger.component.css']
})
export class ScheduleChargerComponent implements OnInit {
  map?: mapboxgl.Map;
  chargerMarkers?: mapboxgl.Marker[] = new Array<mapboxgl.Marker>;
  driverMarker?: mapboxgl.Marker;
  selectedMarker?: mapboxgl.Marker; // Track the selected marker

  // Default Belgrade coordinates for a driver
  driverCoordinates = {
    longitude: 20.457273,
    latitude: 44.787197
  };

  isReadyToMap: boolean = false;
  chargers?: ChargerGetAllItemDto[] = [];

  constructor(
    private chargersService: ChargersService,
    private matDialog: MatDialog) { }
  
  ngOnInit(): void {
    this.getAllChargers().subscribe((response: boolean) => {
      if (response){
        this.isReadyToMap = true;
      }
    });

    // This event will be triggered when 'Schedule' button on route location is clicked
    document.addEventListener('scheduleCharger', (event: any) => {
      const chargerId = event.detail;
      this.openCreateDialog(chargerId);
    });
  }

  async modifyMap(map: mapboxgl.Map) {
    if (!map) {
      return;
    }

    this.map = map;
    this.addGeocoderToMap();
    this.addChargerLocationsToMap();
  }

  addGeocoderToMap() {
    // source: https://docs.mapbox.com/help/tutorials/local-search-geocoding-api/

    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapKey, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      placeholder: 'Enter your location', // Placeholder text for the search bar
    });

    geocoder.on('result', (event) => {
      this.driverCoordinates = {
        longitude: event.result.geometry.coordinates[0],
        latitude: event.result.geometry.coordinates[1]
      }

      // Get the close icon element
      const closeIcon = document.getElementsByClassName('mapboxgl-ctrl-geocoder--icon-close')[0];

      // Add a click event listener to the close icon
      closeIcon.addEventListener('click', () => {
        // Remove the marker if it exists
        if (this.driverMarker) {
          this.driverMarker.remove();
          this.removeRoutesFromMap();
        }
      });

      this.getRoutes();
    });

    this.map!.addControl(geocoder, 'top-left');
  }

  addChargerLocationsToMap() {
    this.chargers!.forEach(charger => {
      const marker = new mapboxgl.Marker({ color: '#3F51B5' })
        .setLngLat([charger.longitude!, charger.latitude!])
        .addTo(this.map!);
  
      this.chargerMarkers?.push(marker);
  
      marker.getElement().addEventListener('click', () => {
        // Remove the popup from the previously selected marker
        if (this.selectedMarker && this.selectedMarker.getPopup()) {
          this.selectedMarker.getPopup()!.remove();
        }
  
        // Set the clicked marker as the selected marker
        this.selectedMarker = marker;
  
        // Add the popup to the clicked marker
        const popupContent = this.addInfoPopupToMap(null, charger);
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
        marker.setPopup(popup).togglePopup();
      });
    });
  }

  private getRoutes() {
    this.removeMarkersFromMap();
    
    const routePromises = this.chargers!.map(charger => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${this.driverCoordinates.longitude},${this.driverCoordinates.latitude};${charger.longitude},${charger.latitude}?geometries=geojson&overview=full&steps=true&access_token=${environment.mapKey}`;
      return axios.get(url);
    });

    axios.all(routePromises)
      .then(axios.spread((...responses) => {
        const routes = responses.map(response => response.data.routes[0]);
        let shortestRoute = routes[0];

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

          const marker = new mapboxgl.Marker({ color: '#3F51B5' });
          marker.setLngLat([this.chargers![index].longitude!, this.chargers![index].latitude!])
            .addTo(this.map!);

          const popupContent = this.addInfoPopupToMap(route, this.chargers![index]);
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
          marker.setPopup(popup);
        });

        this.driverMarker = new mapboxgl.Marker({ color: '#FF4786' })
          .setLngLat([this.driverCoordinates.longitude, this.driverCoordinates.latitude])
          .addTo(this.map!);
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

  addInfoPopupToMap(route?: any, charger?: ChargerGetAllItemDto) {
    return `
      <div style="padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(63, 81, 181); position: relative;">
        <h3 style="font-size: 18px; margin-bottom: 10px; color: #3F51B5; font-weight: bold;">Route Information</h3>
        <p style="margin: 5px 0; font-size: 14px;"><b>Traveling method</b>: Driving</p>
        <p style="margin: 5px 0; font-size: 14px;"><b>Distance</b>: ${(route.distance / 1000).toFixed(2)} km</p>
        <p style="margin: 5px 0;font-size: 14px;"><b>Duration</b>: ${(route.duration / 60).toFixed(2)} minutes</p>
        
        <h3 style="font-size: 18px; margin-bottom: 10px; color: #3F51B5; font-weight: bold; ">Charger Information</h3>
        <p style="margin: 5px 0; font-size: 14px;"><b>Location</b>: ${charger?.location}</p>
        <p style="margin: 5px 0; font-size: 14px; "><b>Charging power</b>: ${charger?.chargingPower} kW</p>
        <p style="margin: 5px 0; font-size: 14px; "><b>Charging protocol</b>: ${charger?.chargingProtocol}</p>
        <p style="margin: 5px 0; font-size: 14px; "><b>Price per kwh</b>: ${charger?.pricePerKwh} $</p>
        <p style="margin: 5px 0; font-size: 14px; "><b>Payment method</b>: ${charger?.paymentMethod}</p>
        <button style="width: 100%; background-color: #3F51B5; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;" 
          onclick="document.dispatchEvent(new CustomEvent('scheduleCharger', { detail: '${charger?.id}' }))">
          Schedule
        </button>
      </div>
    `;
  }

  openCreateDialog(chargerId?: string) {
    this.matDialog.open(ScheduleChargerAddComponent, {
        autoFocus: false,
        data: {
          chargerId: chargerId
        },
        width: '427px',
        height: '609px'
    })
    .afterClosed()
    .subscribe((res) => {
      // this.search();
    });
  }

  removeMarkersFromMap(){
    this.chargerMarkers?.forEach(marker => marker.remove());
  }

  removeRoutesFromMap() {
    // Get all layer IDs on the map
    const allLayerIds = this.map!.getStyle().layers.map(layer => layer.id);
  
    // Filter layer IDs that start with the prefix 'route'
    const routeLayerIds = allLayerIds.filter(id => id.startsWith('route'));
  
    // Remove each layer that matches the criteria
    routeLayerIds.forEach(id => {
      if (this.map!.getLayer(id)) { // Check if the layer exists before attempting to remove it
        this.map!.removeLayer(id);
      }
    });
  
    // Optionally, remove the corresponding sources if needed
    routeLayerIds.forEach(id => {
      if (this.map!.getSource(id)) { // Check if the source exists before attempting to remove it
        this.map!.removeSource(id);
      }
    });
  }
} 
