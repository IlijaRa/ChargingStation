import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChargerSaveDto } from "src/dto";
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

    getAll() {
        return this.chargerModel.find();
    }

    delete(chargerId?: string) {
        return this.chargerModel.findByIdAndDelete(chargerId);
    }
}