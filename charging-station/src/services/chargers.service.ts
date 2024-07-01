import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargerGetAllDto, ChargerGetAllItemDto, ChargerGetByIdDto, ChargerSaveDto, ChargerSearchDto, ChargerSearchItemDto } from "src/dto";
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
            const charger = await this.chargerModel.findById(model._id);

            if (!charger) {
                throw new HttpException('Charger with provided id does not exist', HttpStatus.BAD_REQUEST);
            }

            return this.chargerModel.findByIdAndUpdate(model._id, model);
        }
    }

    async getById(chargerId?: string): Promise<ChargerGetByIdDto> {
        const charger = await this.chargerModel.findById(chargerId);

        if (!charger) {
            throw new HttpException('Charger with provided id does not exist', HttpStatus.BAD_REQUEST);
        }

        const chargerDto: ChargerGetByIdDto = {
            id: charger._id,
            chargingPower: charger.chargingPower,
            chargingProtocol: charger.chargingProtocol,
            pricePerKwh: charger.pricePerKwh,
            paymentMethod: charger.paymentMethod,
            location: charger.location,
            latitude: charger.latitude,
            longitude: charger.longitude
        };

        return chargerDto;
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
        const charger = this.chargerModel.findById(chargerId);
            
        if (!charger) {
            throw new HttpException('Charger with provided id does not exist', HttpStatus.BAD_REQUEST);
        }

        await this.appointmentModel.deleteMany({ chargerId });
        return this.chargerModel.findByIdAndDelete(chargerId);
    }

    async generateAppointments(chargerId: string) {
        const appointmentPromises = [];
        const timeSlots = [
            { start: "00:00", end: "01:59" },
            { start: "02:00", end: "03:59" },
            { start: "04:00", end: "05:59" },
            { start: "06:00", end: "07:59" },
            { start: "08:00", end: "09:59" },
            { start: "10:00", end: "11:59" },
            { start: "12:00", end: "13:59" },
            { start: "14:00", end: "15:59" },
            { start: "16:00", end: "17:59" },
            { start: "18:00", end: "19:59" },
            { start: "20:00", end: "21:59" },
            { start: "22:00", end: "23:59" }
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