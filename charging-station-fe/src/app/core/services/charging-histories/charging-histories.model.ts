export class ChargingHistorySaveDto {
    _id?: string;
    startTime?: Date;
    endTime?: Date;
    cost?: Number;
    paymentMethod?: string;
    takenEnergy?: Number;
    userId?: string;
    chargerId?: string;
}

export class ChargingHistoryGetByIdDto{
    _id?: string;
    startTime?: string;
    endTime?: string;
    cost?: Number;
    paymentMethod?: string;
    takenEnergy?: Number;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}

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