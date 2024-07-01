import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Public } from "src/common";
import { ScheduleChargerSaveDto } from "src/dto";
import { ScheduleChargersService } from "src/services";

@Controller('schedule-charger')
export class ScheduleChargersController {
    constructor(private scheduleChargersService: ScheduleChargersService) {}

    //TODO: check if appointment with model._id exist in the first place before you move forward
    @Post('save')
    save(@Body() model: ScheduleChargerSaveDto) {
        return this.scheduleChargersService.save(model);
    }

    @Get('getall/:driverId')
    getAll(@Param('driverId') driverId: string) {
        return this.scheduleChargersService.getAll(driverId);
    }

    @Public()
    @Post('search/:query?')
    searchByDriver(@Param('query') query?: string, @Query('driverId') driverId?: string) {
        return this.scheduleChargersService.searchByDriver(query, driverId);
    }

    //TODO: check if ScheduleCharger with scheduleChargerId exists in the first place
    @Public()
    @Get('finish/:scheduleChargerId')
    finish(@Param('scheduleChargerId') scheduleChargerId: string) {
        return this.scheduleChargersService.finish(scheduleChargerId);
    }
}