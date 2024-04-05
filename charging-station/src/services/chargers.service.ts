import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargerGetAllDto, ChargerGetAllItemDto, ChargerSaveDto } from "src/dto";
import { Appointment, Charger } from "src/schemas";

@Injectable()
export class ChargersService {
    constructor(
        @InjectModel(Charger.name) private chargerModel: Model<Charger>,
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>) {}

    async save(model?: ChargerSaveDto) {
        if (model._id == null) {
            const savedCharger = await new this.chargerModel(model).save();
            await this.generateAppointments(savedCharger._id);
            return savedCharger;
        } else {
            return this.chargerModel.findByIdAndUpdate(model._id, model);
        }
    }

    getById(chargerId?: string) {
        return this.chargerModel.findById(chargerId);
    }

    async getAll(): Promise<ChargerGetAllDto> {
        const chargers = await this.chargerModel.find();
        const chargerItems: ChargerGetAllItemDto[] = chargers.map(charger => ({
            id: charger._id.toString(),
            chargingPower: charger.chargingPower,
            chargingProtocol: charger.chargingProtocol,
            pricePerKwh: charger.pricePerKwh,
            paymentMethod: charger.paymentMethod,
            location: charger.location
        }));
        return { items: chargerItems };
    }

    async delete(chargerId?: string) {
        await this.appointmentModel.deleteMany({ chargerId });
        return this.chargerModel.findByIdAndDelete(chargerId);
    }

    async generateAppointments(chargerId: string) {
        const appointmentPromises = [];
        const timeSlots = [
            { start: "00:00", end: "02:00" },
            { start: "02:00", end: "04:00" },
            { start: "04:00", end: "06:00" },
            { start: "06:00", end: "08:00" },
            { start: "08:00", end: "10:00" },
            { start: "10:00", end: "12:00" },
            { start: "12:00", end: "14:00" },
            { start: "14:00", end: "16:00" },
            { start: "16:00", end: "18:00" },
            { start: "18:00", end: "20:00" },
            { start: "20:00", end: "22:00" },
            { start: "22:00", end: "00:00" }
        ];
    
        for (const slot of timeSlots) {
            const startDate = new Date();
            const startParts = slot.start.split(":");
            startDate.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
    
            const endDate = new Date();
            const endParts = slot.end.split(":");
            endDate.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
    
            const appointment = new this.appointmentModel({
                startDate: this.formatTime(startDate),
                endDate: this.formatTime(endDate),
                isAvailable: true,
                chargerId: chargerId
            });
            appointmentPromises.push(appointment.save());
        }
    
        await Promise.all(appointmentPromises);
    }

    formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }
}