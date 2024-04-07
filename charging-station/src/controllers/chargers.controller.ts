import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Public } from "src/common";
import { ChargerSaveDto } from "src/dto";
import { ChargersService } from "src/services/chargers.service";

@Controller('chargers')
export class ChargersController {
    constructor(private chargersService: ChargersService) {}

    //TODO: check if charger with model._id exist in the first place before you move forward
    @Public()
    @Post('save')
    save(@Body() model: ChargerSaveDto) {
        return this.chargersService.save(model);
    }

    //TODO: check if charger with chargerId exist in the first place
    @Public()
    @Get('getbyid/:chargerId')
    getById(@Param('chargerId') chargerId: string) {
        return this.chargersService.getById(chargerId);
    }
    
    @Public()
    @Get('getall')
    getAll() {
        return this.chargersService.getAll();
    }

    @Public()
    @Get('search/:query?')
    search(@Param('query') query?: string) {
        return this.chargersService.search(query);
    }

    //TODO: check if charger with chargerId exists in the first place
    @Public()
    @Delete('delete/:chargerId')
    delete(@Param('chargerId') chargerId: string) {
        return this.chargersService.delete(chargerId);
    }
}