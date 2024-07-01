export class ChargingHistoryGetAllDto {
    items?: ChargingHistoryGetAllItemDto[];
}

export class ChargingHistoryGetAllItemDto {
    _id?: string;
    startTime?: string;
    endTime?: string;
    date?: string;
    cost?: Number;
    paymentMethod?: string;
    takenEnergy?: Number;
    user?: string;
    vehicle?: string;
    location?: string;
}