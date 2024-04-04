import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppointmentGetAllDto, AppointmentGetAllItemDto, AppointmentGetByIdDto, AppointmentSaveDto } from "src/dto";
import { Appointment } from "src/schemas";

@Injectable()
export class AppointmentsService {
    constructor(@InjectModel(Appointment.name) private appointmentModel: Model<Appointment>) {}

    save(model?: AppointmentSaveDto) {
        if (model._id == null) {
            return new this.appointmentModel(model).save();
        } else {
            return this.appointmentModel.findByIdAndUpdate(model._id, model);
        }
    }

    async getById(appointmentId?: string): Promise<AppointmentGetByIdDto> {
        const appointment = await this.appointmentModel.findById(appointmentId);

        if (!appointment) {
            return null;
        }

        const appointmentDto: AppointmentGetByIdDto = {
            id: appointment._id.toString(),
            startDate: appointment.startDate,
            endDate: appointment.endDate,
            isAvailable: appointment.isAvailable,
            chargerId: appointment.chargerId,
        };
    
        return appointmentDto;
    }

    async getAll(chargerId?: string): Promise<AppointmentGetAllDto> {
        const appointments = await this.appointmentModel.find({ chargerId });
        const appointmentItems: AppointmentGetAllItemDto[] = appointments.map(appointment => ({
            id: appointment._id.toString(),
            startDate: appointment.startDate,
            endDate: appointment.endDate,
            isAvailable: appointment.isAvailable,
            chargerId: appointment.chargerId,
        }));
        return { items: appointmentItems };
    }

    delete(appointmentId?: string) {
        return this.appointmentModel.findByIdAndDelete(appointmentId);
    }
}