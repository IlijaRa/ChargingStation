import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VehicleGetAllDto, VehicleGetAllItemDto, VehicleSaveDto } from "src/dto";
import { Vehicle } from "src/schemas";

@Injectable()
export class VehiclesService {
    constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>) {}

    async save(model?: VehicleSaveDto) {
        if (model._id) {
            return this.vehicleModel.findByIdAndUpdate(model._id, model);
        } else {
            return new this.vehicleModel(model).save();
        }
    }

    getById(vehicleId?: string) {
        return this.vehicleModel.findById(vehicleId);
    }

    getAllByUserId(userId?: string) {
        return this.vehicleModel.find({ userId });
    }

    async getAll(): Promise<VehicleGetAllDto> {
        const vehicles = await this.vehicleModel.find();
        const vehicleItems: VehicleGetAllItemDto[] = vehicles.map(vehicle => ({
            id: vehicle._id.toString(),
            manufacturer: vehicle.manufacturer,
            vehicleModel: vehicle.vehicleModel,
            batteryCapacity: vehicle.batteryCapacity,
            chargingProtocol: vehicle.chargingProtocol,
        }));
        return { items: vehicleItems };
    }

    delete(vehicleId?: string) {
        return this.vehicleModel.findByIdAndDelete(vehicleId);
    }
}