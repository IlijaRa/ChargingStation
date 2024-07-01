import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

    async getById(chargingHistoryId?: string) {
        const chargingHistory = await this.chargingHistoryModel.findById(chargingHistoryId);

        if (!chargingHistory) {
            throw new HttpException('Charging history with provided id does not exist', HttpStatus.BAD_REQUEST);
        }

        if (!chargingHistory.userId) {
            throw new HttpException('User with provided id does not exist', HttpStatus.BAD_REQUEST);
        }

        if (!chargingHistory.chargerId) {
            throw new HttpException('Charger with provided id does not exist', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userModel.findById(chargingHistory.userId);
        const charger = await this.chargerModel.findById(chargingHistory.chargerId);

        const chargingHistoryDto: ChargingHistoryGetByIdDto = {
            _id: chargingHistory._id,
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
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new HttpException('User with provided id does not exist', HttpStatus.BAD_REQUEST);
        }

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
        
        return { items: chargingHistoryItems };
    }
}