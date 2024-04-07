export class VehicleSearchDto {
    items?: VehicleSearchItemDto[];
}

export class VehicleSearchItemDto {
    id?: string;
    manufacturer?: string;
    vehicleModel?: string;
    batteryCapacity?: number;
    chargingProtocol?: string;
}