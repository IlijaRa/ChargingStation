import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChargerSaveDto } from "src/dto";
import { ChargersService } from "src/services/chargers.service";

@Controller('chargers')
export class ChargersController {
    constructor(private chargersService: ChargersService) {}

    //TODO: check if charger with model._id exist in the first place before you move forward
    @Post('save')
    save(@Body() model: ChargerSaveDto) {
        return this.chargersService.save(model);
    }

    //TODO: check if charger with chargerId exist in the first place
    @Get('getbyid/:chargerId')
    getById(@Param('chargerId') chargerId: string) {
        return this.chargersService.getById(chargerId);
    }

    //TODO: check if charger with chargerId exists in the first place
    @Get('getall')
    getAll() {
        return this.chargersService.getAll();
    }

    //TODO: check if charger with chargerId exists in the first place
    @Delete('delete/:chargerId')
    delete(@Param('chargerId') chargerId: string) {
        return this.chargersService.delete(chargerId);
    }
}