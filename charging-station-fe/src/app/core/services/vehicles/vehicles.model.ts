export class VehicleSaveDto {
    _id?: string
    manufacturer?: string;
    vehicleModel?: string;
    batteryCapacity?: number;
    chargingProtocol?: string;
    userId?: string;
}

export class VehicleGetByIdDto {
    id?: string;
    manufacturer?: string;
    vehicleModel?: string;
    batteryCapacity?: number;
    chargingProtocol?: string;
    userId?: string;
}

export class VehicleGetAllDto {
    items?: VehicleGetAllItemDto[];
}

export class VehicleGetAllItemDto {
    id?: string;
    manufacturer?: string;
    vehicleModel?: string;
    batteryCapacity?: number;
    chargingProtocol?: string;
}