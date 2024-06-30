import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class ScheduleChargerSaveDto {
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
    date?: string;
}