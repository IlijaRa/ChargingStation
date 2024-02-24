import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { VehicleSaveDto } from "src/dto";
import { VehiclesService } from "src/services";

@Controller('vehicles')
export class VehiclesController {
    constructor(private vehiclesService: VehiclesService) {}

    //TODO: check if vehicle with model._id exist in the first place before you move forward
    @Post('save')
    save(@Body() model: VehicleSaveDto) {
        return this.vehiclesService.save(model);
    }

    //TODO: check if vehicle with vehicleId exist in the first place
    @Get('getbyid/:vehicleId')
    getById(@Param('vehicleId') vehicleId: string) {
        return this.vehiclesService.getById(vehicleId);
    }

    //TODO: check if user with userId exists in the first place
    @Get('getall/:userId')
    getAll(@Param('userId') userId: string) {
        return this.vehiclesService.getAll(userId);
    }

    //TODO: check if vehicle with vehicleId exists in the first place
    @Delete('delete/:vehicleId')
    delete(@Param('vehicleId') vehicleId: string) {
        return this.vehiclesService.delete(vehicleId);
    }
}