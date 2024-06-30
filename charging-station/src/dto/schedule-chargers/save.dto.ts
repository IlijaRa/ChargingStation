import { IsNotEmpty, IsString } from "class-validator";

export class ScheduleChargerSaveDto {
    _id?: number;

    @IsNotEmpty()
    @IsString()
    driverId?: string;

    @IsNotEmpty()
    @IsString()
    chargerId?: string;

    @IsNotEmpty()
    @IsString()
    appointmentId?: string;

    @IsNotEmpty()
    @IsString()
    vehicleId?: string;

    @IsNotEmpty()
    @IsString()
    date?: string;
}