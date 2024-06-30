export class ChargingHistoryGetAllDto {
    items?: ChargingHistoryGetAllItemDto[];
}

export class ChargingHistoryGetAllItemDto {
    _id?: string;
    startTime?: string;
    endTime?: string;
    cost?: Number;
    paymentMethod?: string;
    takenEnergy?: Number;
    location?: string;
    latitude?: number;
    longitude?: number;
}