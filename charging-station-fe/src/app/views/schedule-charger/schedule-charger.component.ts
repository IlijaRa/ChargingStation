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
  routes?: any[];

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
          this.removeMarkerPopupsFromMap();
          this.removeRoutesFromMap();
          // this.addChargerLocationsToMap();
        }
      });

      this.getRoutes();
    });

    this.map!.addControl(geocoder, 'top-left');
  }

  addChargerLocationsToMap() {
    // Iterating through all chargers and creating markers
    this.chargers!.forEach(charger => {
      const marker = new mapboxgl.Marker({ color: '#3F51B5' })
        .setLngLat([charger.longitude!, charger.latitude!])
        .addTo(this.map!);
  
      marker.getElement().addEventListener('click', () => {
        // Remove the popup from the previously selected marker
        if (this.selectedMarker && this.selectedMarker.getPopup()) {
          this.selectedMarker.getPopup()!.remove();
        }
  
        // Set the clicked marker as the selected marker
        this.selectedMarker = marker;
  
        // Add the popup to the clicked marker
        const popupContent = this.addInfoPopupToMap(marker, charger);
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

        // Setting the popup and activating it
        marker.setPopup(popup).togglePopup();
      });

      this.chargerMarkers?.push(marker);
    });
  }

  private getRoutes() {
    // this.removeMarkersFromMap();
    
    const routePromises = this.chargers!.map(charger => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${this.driverCoordinates.longitude},${this.driverCoordinates.latitude};${charger.longitude},${charger.latitude}?geometries=geojson&overview=full&steps=true&access_token=${environment.mapKey}`;
      return axios.get(url);
    });

    axios.all(routePromises)
      .then(axios.spread((...responses) => {
        this.routes = responses.map(response => response.data.routes[0]);

        // Calculate the best charger based on the score
        const bestFittingChargerIndex = this.calculateBestFittingCharger(this.routes);

        // this.chargerMarkers = [];

        this.routes.forEach((route, index) => {
          const isBestFittingCharger = index === bestFittingChargerIndex;

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
              'line-color': isBestFittingCharger ? '#FF4786' : '#3F51B5',
              'line-width': isBestFittingCharger ? 8 : 4,
              'line-opacity': isBestFittingCharger ? 1 : 0.75,
              'line-dasharray': isBestFittingCharger ? [1, 0] : [1, 3]
            }
          });

          // const marker = new mapboxgl.Marker({ color: '#3F51B5' });
          // marker.setLngLat([this.chargers![index].longitude!, this.chargers![index].latitude!])
          //   .addTo(this.map!);

          // const popupContent = this.addInfoPopupToMap(route, this.chargers![index]);
          // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
          (this.chargerMarkers![index] as any).routeDistance = route.distance;
          (this.chargerMarkers![index] as any).routeDuration = route.duration;

          // const popupContent = this.addInfoPopupToMap(route, this.chargers![index]);
          // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
          // marker.setPopup(popup);

          // this.chargerMarkers?.push(marker);
        });

        this.driverMarker = new mapboxgl.Marker({ color: '#FF4786' })
          .setLngLat([this.driverCoordinates.longitude, this.driverCoordinates.latitude])
          .addTo(this.map!);
      }))
      .catch(error => {
        console.error('Error fetching directions:', error);
      });
  }

  calculateBestFittingCharger(routes: any[]): number {
    let bestChargerIndex = 0;
    let highestScore = -Infinity;

    // Calculate min and max values for normalization
    const minMaxValues = this.getMinMaxValues(this.chargers!, routes);

    routes.forEach((route, index) => {
      const charger = this.chargers![index];
      const score = this.calculateChargerScore(route, charger, minMaxValues);

      if (score > highestScore) {
        highestScore = score;
        bestChargerIndex = index;
      }
    });

    return bestChargerIndex;
  } 

  calculateChargerScore(route: any, charger: ChargerGetAllItemDto, minMaxValues: any): number {
    const distanceWeight = 0.6;
    const chargingPowerWeight = 0.3;
    const pricePerKwhWeight = 0.1;
  
    // Min-Max normalization for distance
    const minDistance = minMaxValues.minDistance;
    const maxDistance = minMaxValues.maxDistance;
    const distanceScore = (maxDistance - route.distance) / (maxDistance - minDistance);
  
    // Min-Max normalization for charging power
    const minChargingPower = minMaxValues.minChargingPower;
    const maxChargingPower = minMaxValues.maxChargingPower;
    const chargingPowerScore = (charger.chargingPower! - minChargingPower) / (maxChargingPower - minChargingPower);
  
    // Min-Max normalization for price per kWh
    const minPricePerKwh = minMaxValues.minPricePerKwh;
    const maxPricePerKwh = minMaxValues.maxPricePerKwh;
    const pricePerKwhScore = (maxPricePerKwh - charger.pricePerKwh!) / (maxPricePerKwh - minPricePerKwh);
  
    const totalScore = 
      distanceWeight * distanceScore + 
      chargingPowerWeight * chargingPowerScore + 
      pricePerKwhWeight * pricePerKwhScore;
  
    return totalScore;
  }
  
  // Function to get the min and max values for normalization
  getMinMaxValues(chargers: ChargerGetAllItemDto[], routes: any[]): any {
    let minDistance = Infinity, maxDistance = -Infinity;
    let minChargingPower = Infinity, maxChargingPower = -Infinity;
    let minPricePerKwh = Infinity, maxPricePerKwh = -Infinity;
  
    routes.forEach(route => {
      if (route.distance < minDistance) minDistance = route.distance;
      if (route.distance > maxDistance) maxDistance = route.distance;
    });
  
    chargers.forEach(charger => {
      if (charger.chargingPower! < minChargingPower) minChargingPower = charger.chargingPower!;
      if (charger.chargingPower! > maxChargingPower) maxChargingPower = charger.chargingPower!;
      if (charger.pricePerKwh! < minPricePerKwh) minPricePerKwh = charger.pricePerKwh!;
      if (charger.pricePerKwh! > maxPricePerKwh) maxPricePerKwh = charger.pricePerKwh!;
    });
  
    return { minDistance, maxDistance, minChargingPower, maxChargingPower, minPricePerKwh, maxPricePerKwh };
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

  addInfoPopupToMap(selectedMarker?: any, charger?: ChargerGetAllItemDto) {
    return `
      <div style="padding: 10px; border-radius: 8px; box-shadow: 0 2px 8px rgba(63, 81, 181); position: relative;">
        <h3 style="font-size: 18px; margin-bottom: 10px; color: #3F51B5; font-weight: bold;">Route Information</h3>
        <p style="margin: 5px 0; font-size: 14px;"><b>Traveling method</b>: Driving</p>
        <p style="margin: 5px 0; font-size: 14px;"><b>Distance</b>: ${(selectedMarker.routeDistance / 1000).toFixed(2)} km</p>
        <p style="margin: 5px 0;font-size: 14px;"><b>Travel duration</b> ≈ ${Math.round(selectedMarker.routeDuration / 60)} minutes</p>
        
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
    this.chargerMarkers?.forEach(marker => {
      const popup = marker.getPopup();
      if (popup) {
        popup.remove();
      }
      
      marker.remove()}
    );
  }

  removeMarkerPopupsFromMap(){
    this.chargerMarkers?.forEach(marker => {
      const popup = marker.getPopup();
      if (popup) {
        popup.remove();
      }}
    );
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
