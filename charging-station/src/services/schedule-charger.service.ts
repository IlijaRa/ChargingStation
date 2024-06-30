import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ScheduleChargerSaveDto } from "src/dto";
import { Appointment, Charger, ScheduleCharger, User } from "src/schemas";

@Injectable()
export class ScheduleChargersService {
    constructor(
        @InjectModel(ScheduleCharger.name) private scheduleChargerModel: Model<ScheduleCharger>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Charger.name) private chargerModel: Model<Charger>,
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>) {}

    async save(model?: ScheduleChargerSaveDto) {
        const existingDriver = await this.userModel.find({ id: model.driverId, role: 'driver' });

        if (!existingDriver) {
            throw new HttpException('Driver with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        const existingCharger = await this.chargerModel.findById(model.chargerId);

        if (!existingCharger) {
            throw new HttpException('Charger with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        const existingAppointment = await this.appointmentModel.findById(model.appointmentId);

        if (!existingAppointment) {
            throw new HttpException('Appointment with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        if (!existingAppointment.isAllowed) {
            throw new HttpException('Appointment is not allowed for scheduling.', HttpStatus.BAD_REQUEST);
        }

        // if (!existingAppointment.isAvailable) {
        //     throw new HttpException('Appointment is not available at the moment.', HttpStatus.BAD_REQUEST);
        // }

        const scheduleChargings = await this.scheduleChargerModel.find({
            appointmentId: model.appointmentId,
            date: model.date
        });

        if (scheduleChargings) {
            throw new HttpException('Appointment on this date is already scheduled.', HttpStatus.BAD_REQUEST);
        }

        return await new this.scheduleChargerModel(model).save();
    }

    //#region Helpers
    //endregion
}