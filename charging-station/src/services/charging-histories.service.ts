import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargingHistoryGetByIdDto, ChargingHistorySaveDto } from "src/dto";
import { Charger, ChargingHistory, User } from "src/schemas";

@Injectable()
export class ChargingHistoriesService {
    constructor(
        @InjectModel(ChargingHistory.name) private chargingHistoryModel: Model<ChargingHistory>,
        @InjectModel(User.name) private userModel: Model<User>,
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
            startTime: chargingHistory.startTime,
            endTime: chargingHistory.endTime,
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

    getAll() {
        return this.chargingHistoryModel.find();
    }
}