import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
    batteryCapacity?: Number;
    
    @IsNotEmpty()
    @IsString()
    chargingProtocol?: string;

    @IsNotEmpty()
    @IsString()
    userId?: string;
}