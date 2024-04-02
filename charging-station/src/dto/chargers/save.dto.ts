import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChargerSaveDto {
    _id?: string;

    @IsNotEmpty()
    @IsNumber()
    chargingPower?: number;

    @IsNotEmpty()
    @IsString()
    chargingProtocol?: string;

    @IsNotEmpty()
    @IsNumber()
    pricePerKwh?: number;

    @IsNotEmpty()
    @IsString()
    paymentMethod?: string;

    @IsNotEmpty()
    @IsBoolean()
    isAvailable?: boolean;

    @IsNotEmpty()
    @IsString()
    location?: string;

    @IsNotEmpty()
    @IsNumber()
    latitude?: number;

    @IsNotEmpty()
    @IsNumber()
    longitude?: number;
}