import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChargingHistoryGetByIdDto{
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
    firstName?: string;

    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsString()
    emailAddress?: string;
    
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