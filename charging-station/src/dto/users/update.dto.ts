import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UserUpdateDto {
    @IsNotEmpty()
    @IsString()
    _id?: string;

    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @Type(() => Date)
    dateOfBirth?: Date;

    @IsNotEmpty()
    @IsString()
    biography?: string;

    @IsNotEmpty()
    @IsString()
    username?: string;

    @IsNotEmpty()
    @IsString()
    emailAddress?: string;

    @IsNotEmpty()
    @IsString()
    role?: string;

    @IsNotEmpty()
    @IsString()
    gender?: string;

    // @IsNotEmpty()
    // @IsBoolean()
    // isBlocked?: boolean;

    // @IsNotEmpty()
    // @IsBoolean()
    // isConfirmed?: boolean;
}