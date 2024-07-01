import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChargingHistorySaveDto {
    _id?: string;

    @IsNotEmpty()
    @IsString()
    date?: string;

    @IsNotEmpty()
    @IsNumber()
    cost?: Number;

    @IsNotEmpty()
    @IsString()
    paymentMethod?: string;

    @IsNotEmpty()
    @IsNumber()
    takenEnergy?: Number;

    @IsNotEmpty()
    @IsString()
    userId?: string;

    @IsNotEmpty()
    @IsString()
    chargerId?: string;

    @IsNotEmpty()
    @IsString()
    vehicleId?: string;

    @IsNotEmpty()
    @IsString()
    appointmentId?: string;
}