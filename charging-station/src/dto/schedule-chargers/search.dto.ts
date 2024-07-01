export class ScheduleChargerSearchDto {
    items?: ScheduleChargerSearchItemDto[];
}

export class ScheduleChargerSearchItemDto {
    _id?: number;
    driverId?: string;
    driverName?: string;
    chargerId?: string;
    location?: string;
    appointmentId?: string;
    startTime?: string;
    endTime?: string;
    vehicleId?: string;
    vehicleModel?: string;
    date?: string;
}