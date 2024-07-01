import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class VehicleSaveDto {
    _id?: string
    
    @IsNotEmpty()
    @IsString()
    manufacturer?: string;

    @IsNotEmpty()
    @IsString()
    vehicleModel?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    batteryCapacity?: number;
    
    @IsNotEmpty()
    @IsString()
    chargingProtocol?: string;

    @IsNotEmpty()
    @IsString()
    userId?: string;
}