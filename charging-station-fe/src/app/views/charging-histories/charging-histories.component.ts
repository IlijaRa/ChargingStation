import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountsService, ChargingHistoriesService, ChargingHistoryGetAllItemDto, CurrentUserDto, ViewState } from "src/app/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'charging-histories',
    templateUrl: './charging-histories.component.html',
    styleUrls: ['charging-histories.component.css']
})
export class ChargingHistoriesComponent implements OnInit {
    chargingHistories?: ChargingHistoryGetAllItemDto[];
    displayedColumns: string[] = ['location', 'startTime', 'endTime', 'date', 'cost', 'paymentMethod', 'takenEnergy', 'vehicle', 'user'];
    viewState = ViewState;
    user?: CurrentUserDto;

    pageEvent?: PageEvent;
    dataSource: any;
    pageSize: number = 7;
    currentPage: number = 0;
    totalSize: number = 0;

    @ViewChild(MatPaginator) paginator?: MatPaginator;
    
    constructor(
        private chargingHistoriesService: ChargingHistoriesService,
        private accountsService: AccountsService,
        private route: ActivatedRoute
        ) {}

    ngOnInit(): void {
        this.getCurrentUser().then(() => {
            this.getAll();
        })
        .catch((err) => {
            console.error(err);
        });
    }

    private getCurrentUser(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          this.accountsService.getCurrentUser().subscribe({
            next: (user: any) => {
              this.user = user;
              console.log("this.user", this.user);
              resolve();
            },
            error: (err: any) => {
              console.error(err);
              reject(err);
            }
          });
        });
    }

    getAll() {
        this.chargingHistoriesService.getAll(this.user?._id).subscribe({
            next: (val: any) => {
                this.chargingHistories = val.items;
                this.dataSource = new MatTableDataSource<ChargingHistoryGetAllItemDto>(val.items);
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