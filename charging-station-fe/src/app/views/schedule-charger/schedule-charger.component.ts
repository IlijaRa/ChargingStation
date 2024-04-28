import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChargerGetAllItemDto, ChargersService } from 'src/app/core';

@Component({
  selector: 'app-schedule-charger',
  templateUrl: './schedule-charger.component.html',
  styleUrls: ['./schedule-charger.component.css']
})
export class ScheduleChargerComponent implements OnInit {
  
  isReadyToMap: boolean = false;
  chargers?: ChargerGetAllItemDto[] = [];

  constructor(private chargersService?: ChargersService) { }
  
  ngOnInit(): void {
    this.getAllChargers().subscribe((response: boolean) => {
      if (response){
        this.isReadyToMap = true;
        console.log("chargers", this.chargers);
      }
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
} 
