import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationDto } from "src/dto";
import { AccountsService } from "src/services";

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @Post('register')
    register(@Body() model: RegistrationDto) {
        return this.accountsService.register(model);
    }
}