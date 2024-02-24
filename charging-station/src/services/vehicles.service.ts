import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VehicleSaveDto } from "src/dto";
import { Vehicle } from "src/schemas";

@Injectable()
export class VehiclesService {
    constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>) {}

    save(model?: VehicleSaveDto) {
        if (model._id == null) {
            return new this.vehicleModel(model).save();
        } else {
            return this.vehicleModel.findByIdAndUpdate(model._id, model);
        }
    }

    getById(vehicleId?: string) {
        return this.vehicleModel.findById(vehicleId);
    }

    getAll(userId?: string) {
        return this.vehicleModel.find({ userId });
    }

    delete(vehicleId?: string) {
        return this.vehicleModel.findByIdAndDelete(vehicleId);
    }
}