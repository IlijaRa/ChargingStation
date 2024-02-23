import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationDto } from "src/dto";
import { AccountsService } from "src/services";

@Controller('accounts')
export class AccountsController {

    constructor(private usersService: AccountsService) {}

    @Post('register')
    register(@Body() register: RegistrationDto) {
        console.log(register);
        return this.usersService.register(register);
    }
}