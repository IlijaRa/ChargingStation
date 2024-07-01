import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class ChargingHistorySaveDto {
    _id?: string;

    @IsNotEmpty()
    @IsString()
    date?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    cost?: Number;

    @IsNotEmpty()
    @IsString()
    paymentMethod?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
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