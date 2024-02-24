import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChargingHistorySaveDto } from "src/dto";
import { ChargingHistoriesService } from "src/services";

@Controller('chargingHistories')
export class ChargingHistoriesController {
    constructor(private chargingHistoriesService: ChargingHistoriesService) {}

    //TODO: check if chargingHistory with model._id exist in the first place before you move forward
    @Post('save')
    save(@Body() model: ChargingHistorySaveDto) {
        return this.chargingHistoriesService.save(model);
    }

    //TODO: check if chargingHistory with chargingHistoryId exist in the first place
    @Get('getbyid/:chargingHistoryId')
    getById(@Param('chargingHistoryId') chargingHistoryId: string) {
        const chargingHistoryDto = this.chargingHistoriesService.getById(chargingHistoryId);
        console.log("chargingHistoryDto", chargingHistoryDto);
        return chargingHistoryDto;
    }

    @Get('getall')
    getAll() {
        return this.chargingHistoriesService.getAll();
    }
}