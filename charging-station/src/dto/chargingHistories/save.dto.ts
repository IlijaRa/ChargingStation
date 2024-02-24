import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChargingHistorySaveDto {
    _id?: string;

    @IsNotEmpty()
    @Type(() => Date)
    startDate?: Date;

    @IsNotEmpty()
    @Type(() => Date)
    endDate?: Date;

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
}