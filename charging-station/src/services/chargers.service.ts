import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargerGetAllDto, ChargerGetAllItemDto, ChargerSaveDto, ChargerSearchDto, ChargerSearchItemDto } from "src/dto";
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
            location: charger.location,
            longitude: charger.longitude,
            latitude: charger.latitude
        }));
        return { items: chargerItems };
    }

    async search(query?: string): Promise<ChargerSearchDto> {
        let chargers;

        if (this.isEmpty(query)) {
            chargers = await this.chargerModel.find();
        } else {
            const searchCriteria = {
                $or: [
                    { chargingProtocol: new RegExp(query, 'i') },
                    { paymentMethod: new RegExp(query, 'i') },
                    { location: new RegExp(query, 'i') },
                    { chargingPower: parseFloat(query) || 0.0 },
                    { pricePerKwh: parseFloat(query) || 0.0 },
                ]
            };
    
            chargers = await this.chargerModel.find(searchCriteria);
        }

        const chargerItems: ChargerSearchItemDto[] = chargers.map(charger => ({
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
            const startTime = new Date();
            const startParts = slot.start.split(":");
            startTime.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
    
            const endTime = new Date();
            const endParts = slot.end.split(":");
            endTime.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
    
            const appointment = new this.appointmentModel({
                startTime: this.formatTime(startTime),
                endTime: this.formatTime(endTime),
                isAvailable: true,
                isAllowed: true,
                chargerId: chargerId
            });
            appointmentPromises.push(appointment.save());
        }
    
        await Promise.all(appointmentPromises);
    }

    //#region Helpers

    private isEmpty(value) {
        return (value == null || (typeof value === "string" && value.trim().length === 0));
    }

    private formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    //#endregion
}