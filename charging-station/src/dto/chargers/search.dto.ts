export class ChargerSearchDto {
    items?: ChargerSearchItemDto[];
}

export class ChargerSearchItemDto {
    id?: string;
    chargingPower?: number;
    chargingProtocol?: string;
    pricePerKwh?: number;
    paymentMethod?: string;
    // isAvailable?: boolean;
    location?: string;
}