import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import axios from 'axios';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  map?: mapboxgl.Map;
  start = [19.843052026055503, 45.245440118008624]; // Example start point [lng, lat]
  end = [20.489303, 44.769119]; // Example end point [lng, lat]
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

    // const search = new MapboxSearchBox();
    // search.accessToken = environment.mapKey;
    // this.map?.addControl(search);

    this.emitMap();
  }

  emitMap() {
    this.mapResult.emit(this.map);
  }

  ngAfterViewInit(): void {
    // this.addMarkersToMap(this.markerInfos);
  }

  // addMarkersToMap(markerInfos?: any[]) {
  //   markerInfos?.forEach(markerInfo => {
  //     const marker = new mapboxgl.Marker({ color: '#3F51B5' });
  //     marker.setLngLat([markerInfo.longitude, markerInfo.latitude]);
  //     marker.addTo(this.map!);
  //   });
  // }
}