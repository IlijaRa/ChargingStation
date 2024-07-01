export class ScheduleChargerGetAllDto {
    items?: ScheduleChargerGetAllItemDto[];
}

export class ScheduleChargerGetAllItemDto {
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