import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  map?: mapboxgl.Map;

  @Input() markerInfos?: any[];
  @Output() mapResult = new EventEmitter<mapboxgl.Map>();

  constructor() {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [19.843052026055503, 45.245440118008624], // Novi Sad coordinates
      zoom: 12,
      accessToken: environment.mapKey
    });

    this.emitMap();
  }

  emitMap() {
    this.mapResult.emit(this.map);
  }

  ngAfterViewInit(): void {
    console.log('this.markerInfos', this.markerInfos);
    this.addMarkersToMap(this.markerInfos);
  }

  addMarkersToMap(markerInfos?: any[]) {
    markerInfos?.forEach(markerInfo => {
      const marker = new mapboxgl.Marker({ color: '#FF4786' });
      marker.setLngLat([markerInfo.longitude, markerInfo.latitude]);
      marker.addTo(this.map!);
    });
  }
}