import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class AppointmentSaveDto {
    _id?: string

    @IsNotEmpty()
    @Type(() => Date)
    startTime?: Date;

    @IsNotEmpty()
    @Type(() => Date)
    endTime?: Date;

    @IsNotEmpty()
    @IsBoolean()
    isAvailable?: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isAllowed?: boolean;

    @IsNotEmpty()
    @IsString()
    chargerId?: string;
}