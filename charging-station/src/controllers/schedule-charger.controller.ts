import { Body, Controller, Post } from "@nestjs/common";
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
}