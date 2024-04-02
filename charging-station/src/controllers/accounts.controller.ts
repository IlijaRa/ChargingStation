import { Body, Controller, Get, Post } from "@nestjs/common";
import { GetCurrentUserId } from "src/common";
import { AccountsService } from "src/services";

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @Get('getcurrentuser')
    getCurrentUser(@GetCurrentUserId() userId: string) {
        return this.accountsService.getCurrentUser(userId);
    }

    @Get('checkcredentials')
    checkCredentials(@Body() usernameOrEmail: string) {
        return this.accountsService.checkCredentials(usernameOrEmail);
    }
}