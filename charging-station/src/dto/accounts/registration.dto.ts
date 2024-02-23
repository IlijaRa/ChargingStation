import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class RegistrationDto {
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
}