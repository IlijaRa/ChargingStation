import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppointmentSaveDto } from "src/dto/appointments/save.dto";
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

    getById(appointmentId?: string) {
        return this.appointmentModel.findById(appointmentId);
    }

    getAll(chargerId?: string) {
        return this.appointmentModel.find({ chargerId });
    }

    delete(appointmentId?: string) {
        return this.appointmentModel.findByIdAndDelete(appointmentId);
    }
}