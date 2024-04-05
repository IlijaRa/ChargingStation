export class ChargerGetAllDto {
    items?: ChargerGetAllItemDto[];
}

export class ChargerGetAllItemDto {
    id?: string;
    chargingPower?: number;
    chargingProtocol?: string;
    pricePerKwh?: number;
    paymentMethod?: string;
    // isAvailable?: boolean;
    location?: string;
}