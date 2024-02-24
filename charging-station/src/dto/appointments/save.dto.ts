import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class AppointmentSaveDto {
    _id?: string

    @IsNotEmpty()
    @Type(() => Date)
    startDate?: Date;

    @IsNotEmpty()
    @Type(() => Date)
    endDate?: Date;

    @IsNotEmpty()
    @IsString()
    chargerId?: string;
}