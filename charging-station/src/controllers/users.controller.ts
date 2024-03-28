import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { Public } from "src/common";
import { UserUpdateDto } from "src/dto";
import { UsersService } from "src/services";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Public()
    @Put('update')
    @HttpCode(HttpStatus.NO_CONTENT)
    update(@Body() model: UserUpdateDto) {
        return this.usersService.update(model);
    }

    //TODO: check if user with userId exist in the first place
    @Public()
    @Get('getbyid/:userId')
    getById(@Param('userId') userId: string) {
        return this.usersService.getById(userId);
    }

    @Public()
    @Get('getall')
    getAll() {
        return this.usersService.getAll();
    }

    @Public()
    @Get('getallconfirmed')
    getAllConfirmed() {
        return this.usersService.getAllConfirmed();
    }

    @Public()
    @Get('getallunconfirmed')
    getAllUnconfirmed() {
        return this.usersService.getAllUnconfirmed();
    }

    @Public()
    @Get('getallblocked')
    getAllBlocked() {
        return this.usersService.getAllBlocked();
    }

    @Public()
    @Get('getallunblocked')
    getAllUnblocked() {
        return this.usersService.getAllUnblocked();
    }

    //TODO: check if user with userId exists in the first place
    @Public()
    @Post('block/:userId')
    block(@Param('userId') userId: string) {
        return this.usersService.block(userId);
    }

    //TODO: check if user with userId exists in the first place
    @Public()
    @Post('unblock/:userId')
    unblock(@Param('userId') userId: string) {
        return this.usersService.unblock(userId);
    }

    //TODO: check if user with userId exists in the first place
    @Public()
    @Post('confirm/:userId')
    confirm(@Param('userId') userId: string) {
        return this.usersService.confirm(userId);
    }
}