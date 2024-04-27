import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Public } from "src/common";
import { AppointmentAllowDto, AppointmentSaveDto, AppointmentUnallowDto } from "src/dto";
import { AppointmentsService } from "src/services";

@Controller('appointments')
export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService) {}

    //TODO: check if appointment with model._id exist in the first place before you move forward
    @Post('save')
    save(@Body() model: AppointmentSaveDto) {
        return this.appointmentsService.save(model);
    }

    @Public()
    @Post('allow')
    allow(@Body() model: AppointmentAllowDto) {
        return this.appointmentsService.allow(model);
    }

    @Public()
    @Post('unallow')
    unallow(@Body() model: AppointmentUnallowDto) {
        return this.appointmentsService.unallow(model);
    }

    //TODO: check if appointment with appointmentId exist in the first place
    @Get('getbyid/:appointmentId')
    getById(@Param('appointmentId') appointmentId: string) {
        return this.appointmentsService.getById(appointmentId);
    }

    //TODO: check if charger with chargerId exists in the first place
    @Get('getall/:chargerId')
    getAll(@Param('chargerId') chargerId: string) {
        return this.appointmentsService.getAll(chargerId);
    }

    //TODO: check if appointment with appointmentId exists in the first place
    @Delete('delete/:appointmentId')
    delete(@Param('appointmentId') appointmentId: string) {
        return this.appointmentsService.delete(appointmentId);
    }
}