export class ChargerGetAllDto {
    items?: ChargerGetAllItemDto[];
}

export class ChargerGetAllItemDto {
    id?: string;
    chargingPower?: number;
    chargingProtocol?: string;
    pricePerKwh?: number;
    paymentMethod?: string;
    location?: string;
    longitude?: number;
    latitude?: number;
}