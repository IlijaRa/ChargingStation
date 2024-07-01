import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VehicleGetAllDto, VehicleGetAllItemDto, VehicleSaveDto, VehicleSearchDto, VehicleSearchItemDto } from "src/dto";
import { User, Vehicle } from "src/schemas";

@Injectable()
export class VehiclesService {
    constructor(
        @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
        @InjectModel(User.name) private userModel: Model<User>) {}

    async save(model?: VehicleSaveDto) {
        if (model._id) {
            const vehicle = await this.vehicleModel.findById(model._id);
        
            if (!vehicle) {
                throw new HttpException('Vehicle with provided id does not exist.', HttpStatus.BAD_REQUEST);
            }

            return this.vehicleModel.findByIdAndUpdate(model._id, model);
        } else {
            return new this.vehicleModel(model).save();
        }
    }

    async getById(vehicleId?: string) {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        
        if (!vehicle) {
            throw new HttpException('Vehicle with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        return this.vehicleModel.findById(vehicleId);
    }

    async getAllByUserId(userId?: string): Promise<VehicleGetAllDto> {
        const user = await this.userModel.findById(userId);
        
        if (!user) {
            throw new HttpException('User with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        const vehicles = await this.vehicleModel.find({ userId });
        const vehicleItems: VehicleGetAllItemDto[] = vehicles.map(vehicle => ({
            id: vehicle._id.toString(),
            manufacturer: vehicle.manufacturer,
            vehicleModel: vehicle.vehicleModel,
            batteryCapacity: vehicle.batteryCapacity,
            chargingProtocol: vehicle.chargingProtocol,
        }));
        return { items: vehicleItems };
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

    async searchByDriver(query?: string, driverId?: string): Promise<VehicleSearchDto> {
        const existingDriver = await this.userModel.findOne({ _id: driverId, role: 'driver' });
        
        if (!existingDriver) {
            throw new HttpException('Driver user with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        let vehicles;

        if (this.isEmpty(query)) {
            vehicles = await this.vehicleModel.find({ userId: driverId });
        } else {
            const searchCriteria = {
                $or: [
                    { manufacturer: new RegExp(query, 'i') },
                    { vehicleModel: new RegExp(query, 'i') },
                    { chargingProtocol: new RegExp(query, 'i') },
                    { batteryCapacity: parseFloat(query) || 0.0 },
                ],
                $and: [
                    { userId: driverId }
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

    async delete(vehicleId?: string) {
        const vehicle = await this.vehicleModel.findById(vehicleId);
        
        if (!vehicle) {
            throw new HttpException('Vehicle with provided id does not exist.', HttpStatus.BAD_REQUEST);
        }

        return this.vehicleModel.findByIdAndDelete(vehicleId);
    }

    //#region Helpers

    private isEmpty(value) {
        return (value == undefined || value == null || (typeof value === "string" && value.trim().length === 0));
    }

    //#endregion
}