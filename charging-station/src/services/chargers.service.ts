import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargerGetAllDto, ChargerGetAllItemDto, ChargerSaveDto } from "src/dto";
import { Charger } from "src/schemas";

@Injectable()
export class ChargersService {
    constructor(@InjectModel(Charger.name) private chargerModel: Model<Charger>) {}

    save(model?: ChargerSaveDto) {
        if (model._id == null) {
            return new this.chargerModel(model).save();
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

    delete(chargerId?: string) {
        return this.chargerModel.findByIdAndDelete(chargerId);
    }
}