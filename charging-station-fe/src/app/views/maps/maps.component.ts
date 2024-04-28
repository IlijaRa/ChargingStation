import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {
  map?: mapboxgl.Map;

  @Input() markerInfos?: any[];

  constructor() {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.00362959345136, 40.72073260421214], // New York coordinates
      zoom: 4,
      accessToken: environment.mapKey
    });
  }

  ngAfterViewInit(): void {
    console.log('this.markerInfos', this.markerInfos);
    this.addMarkersToMap(this.markerInfos);
  }

  addMarkersToMap(markerInfos?: any[]) {
    markerInfos?.forEach(markerInfo => {
      const marker = new mapboxgl.Marker({ color: '#F84C4C' });
      marker.setLngLat([markerInfo.longitude, markerInfo.latitude]);
      marker.addTo(this.map!);
    });
  }
}