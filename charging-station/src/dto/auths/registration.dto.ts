import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class RegistrationDto {
    _id?: string

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
    @IsStrongPassword()
    password?: string;

    @IsNotEmpty()
    @IsString()
    role?: string;

    @IsNotEmpty()
    @IsString()
    gender?: string;
}