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