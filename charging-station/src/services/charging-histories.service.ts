import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargingHistoryGetAllDto, ChargingHistoryGetAllItemDto, ChargingHistoryGetByIdDto, ChargingHistorySaveDto } from "src/dto";
import { Appointment, Charger, ChargingHistory, User, Vehicle } from "src/schemas";

@Injectable()
export class ChargingHistoriesService {
    constructor(
        @InjectModel(ChargingHistory.name) private chargingHistoryModel: Model<ChargingHistory>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        @InjectModel(Charger.name) private chargerModel: Model<Charger>
    ) {}

    save(model?: ChargingHistorySaveDto) {
        return new this.chargingHistoryModel(model).save();
    }

    //TODO: make a validation if chargingHistory, user and charger are not null or undefined
    //TODO: utilize automapper instead of bruteforce mapping
    async getById(chargingHistoryId?: string) {
        const chargingHistory = await this.chargingHistoryModel.findById(chargingHistoryId);
        const user = await this.userModel.findById(chargingHistory.userId);
        const charger = await this.chargerModel.findById(chargingHistory.chargerId);

        const chargingHistoryDto: ChargingHistoryGetByIdDto = {
            _id: chargingHistory._id,
            // startTime: chargingHistory.startTime,
            // endTime: chargingHistory.endTime,
            cost: chargingHistory.cost,
            paymentMethod: chargingHistory.paymentMethod,
            takenEnergy: chargingHistory.takenEnergy,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            location: charger.location,
            latitude: charger.latitude,
            longitude: charger.longitude
        };

        return chargingHistoryDto;
    }

    async getAll(userId?: string): Promise<ChargingHistoryGetAllDto> {
        const chargingHistories = await this.chargingHistoryModel.find({ userId });
        let chargingHistoryItems: ChargingHistoryGetAllItemDto[] = [];
        
        // Create an array of promises
        const promises = chargingHistories.map(async chargingHistory => {
            const appointment = await this.appointmentModel.findOne({ _id: chargingHistory.appointmentId });
            const user = await this.userModel.findOne({ _id: chargingHistory.userId });
            const vehicle = await this.vehicleModel.findOne({ _id: chargingHistory.vehicleId });
            const charger = await this.chargerModel.findOne({ _id: chargingHistory.chargerId });
    
            const item = {
                _id: chargingHistory._id,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                date: chargingHistory.date,
                cost: chargingHistory.cost,
                paymentMethod: chargingHistory.paymentMethod,
                takenEnergy: chargingHistory.takenEnergy,
                user: `${user.firstName} ${user.lastName}`,
                vehicle: vehicle.vehicleModel,
                location: charger.location
            };
    
            chargingHistoryItems.push(item);
        });
    
        // Wait for all promises to resolve
        await Promise.all(promises);
    
        // Optionally sort the items
        // chargingHistoryItems.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        return { items: chargingHistoryItems };
    }
}