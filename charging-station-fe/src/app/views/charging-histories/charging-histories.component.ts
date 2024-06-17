import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppointmentGetAllDto, ChargingHistoriesService, ChargingHistoryGetAllItemDto, ViewState } from "src/app/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'charging-histories',
    templateUrl: './charging-histories.component.html',
    styleUrls: ['charging-histories.component.css']
})
export class ChargingHistoriesComponent implements OnInit {
    chargingHistories?: ChargingHistoryGetAllItemDto[];
    displayedColumns: string[] = ['startTime', 'endTime', 'cost', 'paymentMethod', 'takenEnergy'];
    viewState = ViewState;
    driverId?: string;

    pageEvent?: PageEvent;
    dataSource: any;
    pageSize: number = 7;
    currentPage: number = 0;
    totalSize: number = 0;

    @ViewChild(MatPaginator) paginator?: MatPaginator;
    
    constructor(
        private chargingHistoriesService: ChargingHistoriesService,
        private route: ActivatedRoute
        ) {}

    ngOnInit(): void {
        this.route.params.subscribe((value: any) => {
            this.driverId = value.id;
            this.getAll();
        })
    }

    getAll() {
        this.chargingHistoriesService.getAll(this.driverId).subscribe({
            next: (val: any) => {
                this.chargingHistories = val.items;
                this.dataSource = new MatTableDataSource<AppointmentGetAllDto>(val.items);
                this.dataSource.paginator = this.paginator;
                this.totalSize = this.chargingHistories?.length!;
                this.iterator();
            },
            error: (err: any) => {
              console.error(err);
            }
        })
    }

    handlePageEvent(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
        this.iterator();
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.chargingHistories?.slice(start, end);
        this.dataSource = part;
    }
}