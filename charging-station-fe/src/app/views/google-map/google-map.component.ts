import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { } from 'googlemaps';
import { environment } from "src/environments/environment";

export class GoogleMapLocationData {
    address?: string;
    data?: any;
}

export class GoogleMapDistance {
    duration?: any;
    durationText?: string;
    distance?: any;
    distanceText?: string;
}

@Component({
    selector: 'google-map',
    templateUrl: './google-map.component.html'
})
export class GoogleMapComponent implements OnInit {

    private _origin?: GoogleMapLocationData;

    invalidDestinations: string[] = [];
    invalidOrigins: string[] = [];
    invalidDirections: string[] = [];

    @Input() set origin(destination: GoogleMapLocationData | undefined) {
        this._origin = destination;
        this.closeInfoWindow();
        this.removeOriginMarker();
        this.removeDestinationDistances();
        this.createDestinationDistances();
        this.createOriginMarker().then(() => {
            this.removeDirections();
            this.createDirections();
            this.fitMapBounds();
        })
    }

    get origin(): GoogleMapLocationData | undefined {
        return this._origin;
    }

    private _destinations?: GoogleMapLocationData[];

    @Input() set destinations(destinations: GoogleMapLocationData[] | undefined){
        this._destinations = destinations;
        this.closeInfoWindow();
        this.removeDestinationMarkers();
        this.removeDestinationDistances();
        this.createDestinationMarkers().then(() => {
            this.createDestinationDistances();
            this.removeDirections();
            this.createDirections();
            this.fitMapBounds();
        });
    }

    get destinations(): GoogleMapLocationData[] | undefined {
        return this._destinations;
    }

    @Input() onCreateDestinationMarkerInfo?: any;

    map?: google.maps.Map;
    originMarker?: any = undefined;
    destinationMarkers: any[] = [];
    destinationDistances: any[] = [];
    directionRenderers: google.maps.DirectionsRenderer[] = [];

    currentInfoWindow: google.maps.InfoWindow | undefined;

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        this.createMap();
    }

    private async createMap() {
        this.map = new google.maps.Map(this.el.nativeElement.children[0].children[0], {
            zoom: 10,
            center: { lat: 40.730610, lng: -73.935242 },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
        });
    }

    private closeInfoWindow() {
        if (this.currentInfoWindow) {
            this.currentInfoWindow.close();
        }
    }

    private async createOriginMarker(): Promise<void> {

        return new Promise<void>(async (resolve) => {

            this.invalidOrigins = [];

            if (this.origin && this.origin.address && this.origin.address.trim() != '') {
                try {
                    let latLng = await this.getLatLng(this.origin!.address);

                    this.originMarker = new google.maps.Marker({
                        position: latLng,
                        map: this.map,
                        icon: '/assets/images/map/blue-point.svg',
                    });

                    this.originMarker.addListener("click", () => {

                        if (this.currentInfoWindow) {
                            this.currentInfoWindow.close();
                        }

                        const infoWindow = new google.maps.InfoWindow({
                            content: `  <div style="padding: 5px">
                                            <div style="padding: 1px">
                                                <span style="margin-right: 5px">Patient location:</span><span style="font-weight: bold;">${this.origin && this.origin.address ? this.origin.address.trim() : '-'}</span>
                                            </div>
                                        </div>`
                        });
            
                        infoWindow.open(this.map, this.originMarker);

                        this.currentInfoWindow = infoWindow;
                    });   

                } catch (error) {
                    this.invalidOrigins.push(this.origin.address);
                }
            }

            resolve();
        });
    }

    private async createDestinationMarkers(): Promise<void>  {

        return new Promise<void>(async (resolve) => {

            this.invalidDestinations = [];

            if (this.destinations) {
                for (let i = 0; i < this.destinations.length; i++) {

                    let marker: any = undefined;

                    try {
                        let latLng = await this.getLatLng(this.destinations[i].address);

                        marker = new google.maps.Marker({
                            position: latLng,
                            map: this.map,
                            icon: '/assets/images/map/red-point.svg',
                        });

                        let destinations = this.destinations;
                        let destinationDistances = this.destinationDistances;

                        marker.addListener("click", () => {

                            let markerInfoContent = this.onCreateDestinationMarkerInfo ? this.onCreateDestinationMarkerInfo(destinations[i], destinationDistances[i]) : undefined;

                            if (!markerInfoContent) {
                                return;
                            }

                            if (this.currentInfoWindow) {
                                this.currentInfoWindow.close();
                            }

                            const infoWindow = new google.maps.InfoWindow({
                                content: markerInfoContent
                            });
                
                            infoWindow.open(this.map, marker);

                            this.currentInfoWindow = infoWindow;
                        }); 
    
                    } catch (error) {
                        this.invalidDestinations.push(this.destinations[i].address!);
                    }

                    this.destinationMarkers.push(marker);
                }
            }
        
            resolve();
        });
    }

    private async createDirections() {

        this.invalidDirections = [];

        if (!this.originMarker || this.destinationMarkers.length == 0) {
            return;
        }

        let directionsService = new google.maps.DirectionsService();

        let directionResponses: google.maps.DirectionsResult[] = [];

        let minimalDuration = Infinity;

        for (let i = 0; i < this.destinationMarkers.length; i++) {

            if (!this.destinationMarkers[i]) {
                continue;
            }

            const route = {
                origin: this.originMarker.getPosition()!,
                destination: this.destinationMarkers[i].getPosition()!,
                travelMode: google.maps.TravelMode['DRIVING']
            }

            try {
                await directionsService.route(route, (response, status) => {
                    if (status !== 'OK') {
                        this.invalidDirections.push(`${this.origin?.address ? this.origin.address : '-'} > ${this.destinations && this.destinations[i]?.address ? this.destinations[i].address : '-'}`);
                    } else {

                        let duration = response.routes[0].legs[0].duration.value;
                        let durationText = response.routes[0].legs[0].duration.text;
                        let distance = response.routes[0].legs[0].distance.value;
                        let distanceText = response.routes[0].legs[0].distance.text;

                        this.destinationDistances[i] = new GoogleMapDistance();
                        this.destinationDistances[i].duration = duration;
                        this.destinationDistances[i].durationText = durationText;
                        this.destinationDistances[i].distance = distance;
                        this.destinationDistances[i].distanceText = distanceText;

                        if (duration < minimalDuration) {
                            minimalDuration = duration;
                            directionResponses.splice(0, 0, response);
                        } else {
                            directionResponses.push(response);
                        }
                    }
                });
            } catch (error) {
            }
        }

        for (let i = 0; i < directionResponses.length; i++) {
            let directionRenderer = new google.maps.DirectionsRenderer({
                directions: directionResponses[i],
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: i == 0 ? '#FF0000' : '#4e79c5',
                    strokeWeight: i == 0 ? 8 : 6,
                    strokeOpacity: i == 0 ? 1 : 0.7,
                    zIndex: directionResponses.length - i
                },
                map: this.map
            });

            this.directionRenderers.push(directionRenderer);
        }
    }

    private removeOriginMarker() {
        if (this.originMarker) {
            this.originMarker.setMap(null);
        }

        this.originMarker = undefined;
    }

    private removeDestinationMarkers() {
        this.destinationMarkers.forEach(marker => {
            if (marker) {
                marker.setMap(null);
            }
        });
        
        this.destinationMarkers.splice(0, this.destinationMarkers.length);
    }

    private createDestinationDistances() {
        this.destinationMarkers.forEach(marker => {
            this.destinationDistances.push(undefined);
        });
    }

    private removeDestinationDistances() {
        this.destinationDistances.splice(0, this.destinationDistances.length);
    }

    private removeDirections() {
        if (this.directionRenderers) {
            this.directionRenderers.forEach(marker => {
                marker.setMap(null);
            });

            this.directionRenderers.splice(0, this.directionRenderers.length);
        }
    }

    private async getLatLng(location?: string): Promise<google.maps.LatLng> {
        
        if (!location){
            throw new Error(`Geocoding failed`);
        }

        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${environment.googleMapKey}`);
        const data = await response.json();

        if (data.status === 'OK') {
            return data.results[0].geometry.location as google.maps.LatLng;
        } else {
            throw new Error(`Geocoding failed: ${data.status}`);
        }
    }

    private fitMapBounds(){
        setTimeout(async () => {
            let markers: google.maps.LatLng[] = [];

            this.destinationMarkers.forEach(destination => {
                if (destination) {
                    let position = destination.getPosition();
                    if (position) {
                        markers.push(position!);
                    }
                }
            });

            if (this.originMarker) {
                markers.push(this.originMarker.getPosition()!);
            }

            var bounds = new google.maps.LatLngBounds();
            if (markers.length > 0) {

                for (var i = 0; i < markers.length; i++) {
                    if (markers[i]) {
                        bounds.extend(markers[i]);
                    }
                }

                if (markers.length == 1) {
                    const center = bounds.getCenter();
                    const latLngOffsets = [
                        new google.maps.LatLng(center.lat() + 0.1, center.lng() + 0.1),
                        new google.maps.LatLng(center.lat() + 0.1, center.lng() - 0.1),
                        new google.maps.LatLng(center.lat() - 0.1, center.lng() + 0.1),
                        new google.maps.LatLng(center.lat() - 0.1, center.lng() - 0.1)
                    ];

                    for (const offsetLatLng of latLngOffsets) {
                        bounds.extend(offsetLatLng);
                    }
                }
                
                this.map!.fitBounds(bounds);
            }
        }, 1000)
    }
}