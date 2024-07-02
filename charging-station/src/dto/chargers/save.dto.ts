import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ChargerSaveDto {
    _id?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(320)
    chargingPower?: number;

    @IsNotEmpty()
    @IsString()
    chargingProtocol?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    pricePerKwh?: number;

    @IsNotEmpty()
    @IsString()
    paymentMethod?: string;

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