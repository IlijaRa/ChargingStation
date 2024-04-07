import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VehicleGetAllDto, VehicleGetAllItemDto, VehicleSaveDto, VehicleSearchDto, VehicleSearchItemDto } from "src/dto";
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

    async search(query?: string): Promise<VehicleSearchDto> {
        let vehicles;

        if (this.isEmpty(query)) {
            vehicles = await this.vehicleModel.find();
        } else {
            const searchCriteria = {
                $or: [
                    { manufacturer: new RegExp(query, 'i') },
                    { vehicleModel: new RegExp(query, 'i') },
                    { chargingProtocol: new RegExp(query, 'i') },
                    { batteryCapacity: parseFloat(query) || 0.0 },
                ]
            };
    
            vehicles = await this.vehicleModel.find(searchCriteria);
        }

        const vehicleItems: VehicleSearchItemDto[] = vehicles.map(vehicle => ({
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

    //#region Helpers

    private isEmpty(value) {
        return (value == null || (typeof value === "string" && value.trim().length === 0));
    }

    //#endregion
}