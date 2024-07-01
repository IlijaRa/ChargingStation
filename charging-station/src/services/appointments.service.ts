import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppointmentAllDto, AppointmentAllItemDto, AppointmentAllowDto, AppointmentGetAllDto, AppointmentGetAllItemDto, AppointmentGetByIdDto, AppointmentSaveDto, AppointmentUnallowDto } from "src/dto";
import { Appointment, ScheduleCharger } from "src/schemas";

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        @InjectModel(ScheduleCharger.name) private scheduleChargerModel: Model<ScheduleCharger>) {}

    save(model?: AppointmentSaveDto) {
        if (model._id == null) {
            return new this.appointmentModel(model).save();
        } else {
            return this.appointmentModel.findByIdAndUpdate(model._id, model);
        }
    }

    allow(model?: AppointmentAllowDto) {
        return this.appointmentModel.findByIdAndUpdate(
            { _id: model.appointmentId, chargerId: model.chargerId },
            { isAllowed: true, isAvailable : true }
        );
    }

    unallow(model?: AppointmentUnallowDto) {
        return this.appointmentModel.findByIdAndUpdate(
            { _id: model.appointmentId, chargerId: model.chargerId },
            { isAllowed: false, isAvailable : false }
        );
    }

    async getById(appointmentId?: string): Promise<AppointmentGetByIdDto> {
        const appointment = await this.appointmentModel.findById(appointmentId);

        if (!appointment) {
            return null;
        }

        const appointmentDto: AppointmentGetByIdDto = {
            id: appointment._id.toString(),
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            isAvailable: appointment.isAvailable,
            isAllowed: appointment.isAllowed,
            chargerId: appointment.chargerId,
        };
    
        return appointmentDto;
    }

    async all(chargerId?: string, date?: string): Promise<AppointmentAllDto> {
        const scheduleChargers = await this.scheduleChargerModel.find({
            chargerId: chargerId, 
            date: date
        });

        const appointmentsToAvoid = scheduleChargers.map(x => x.appointmentId);
        const appointments = await this.appointmentModel.find({ 
            chargerId,
            isAllowed: true,
            isAvailable: true, 
            _id: { $nin: appointmentsToAvoid } 
        });

        const appointmentItems: AppointmentAllItemDto[] = appointments.map(appointment => ({
            id: appointment._id.toString(),
            startTime: appointment.startTime,
            endTime: appointment.endTime
        }));

        appointmentItems.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });

        return { items: appointmentItems };
    }

    async getAll(chargerId?: string): Promise<AppointmentGetAllDto> {
        const appointments = await this.appointmentModel.find({ chargerId });
        
        const appointmentItems: AppointmentGetAllItemDto[] = appointments.map(appointment => ({
            id: appointment._id.toString(),
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            isAvailable: appointment.isAvailable,
            isAllowed: appointment.isAllowed,
            chargerId: appointment.chargerId,
        }));

        appointmentItems.sort(function (a, b) {
            return a.startTime.localeCompare(b.startTime);
        });

        return { items: appointmentItems };
    }

    delete(appointmentId?: string) {
        return this.appointmentModel.findByIdAndDelete(appointmentId);
    }
}