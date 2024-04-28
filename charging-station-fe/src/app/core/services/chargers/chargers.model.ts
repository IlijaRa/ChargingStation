export class ChargerSaveDto {
    _id?: string;
    chargingPower?: number;
    chargingProtocol?: string;
    pricePerKwh?: number;
    paymentMethod?: string;
    // isAvailable?: boolean;
    location?: string;
    latitude?: number;
    longitude?: number;
}

export class ChargerGetByIdDto {
    id?: string;
    chargingPower?: number;
    chargingProtocol?: string;
    pricePerKwh?: number;
    paymentMethod?: string;
    // isAvailable?: boolean;
    location?: string;
    latitude?: number;
    longitude?: number;
}

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

export class ChargerSearchDto {
    items?: ChargerSearchItemDto[];
}

export class ChargerSearchItemDto {
    id?: string;
    chargingPower?: number;
    chargingProtocol?: string;
    pricePerKwh?: number;
    paymentMethod?: string;
    location?: string;
}