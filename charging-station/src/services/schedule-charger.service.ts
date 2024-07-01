import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ScheduleChargerGetAllDto, ScheduleChargerGetAllItemDto, ScheduleChargerSaveDto, ScheduleChargerSearchDto, ScheduleChargerSearchItemDto } from "src/dto";
import { Appointment, Charger, ChargingHistory, ScheduleCharger, User, Vehicle } from "src/schemas";

@Injectable()
export class ScheduleChargersService {
    constructor(
        @InjectModel(ScheduleCharger.name) private scheduleChargerModel: Model<ScheduleCharger>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Charger.name) private chargerModel: Model<Charger>,
        @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        @InjectModel(ChargingHistory.name) private chargingHistoryModel: Model<ChargingHistory>,) {}

    async save(model?: ScheduleChargerSaveDto) {
        const existingDriver = await this.userModel.findOne({ _id: model.driverId, role: 'driver' });
        
        if (!existingDriver) {
            throw new HttpException('Driver with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        const existingVehicle = await this.vehicleModel.findOne({ _id: model.vehicleId, userId: model.driverId });
        
        if (!existingVehicle) {
            throw new HttpException('Vehicle with this driver does not exist.', HttpStatus.BAD_REQUEST);
        }

        const existingCharger = await this.chargerModel.findById(model.chargerId);

        if (!existingCharger) {
            throw new HttpException('Charger with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        const existingAppointment = await this.appointmentModel.findOne({ _id: model.appointmentId, chargerId: model.chargerId });

        if (!existingAppointment) {
            throw new HttpException('Appointment with this id does not exist for mentioned charger.', HttpStatus.BAD_REQUEST);
        }

        if (!existingAppointment.isAllowed) {
            throw new HttpException('Appointment is not allowed for scheduling.', HttpStatus.BAD_REQUEST);
        }

        const scheduleChargings = await this.scheduleChargerModel.findOne({
            chargerId: model.chargerId,
            appointmentId: model.appointmentId,
            date: model.date
        });

        if (scheduleChargings) {
            throw new HttpException('Appointment on this date and time is already scheduled.', HttpStatus.BAD_REQUEST);
        }

        return await new this.scheduleChargerModel(model).save();
    }

    async getAll(driverId?: string): Promise<ScheduleChargerGetAllDto> {
        const existingDriver = await this.userModel.findOne({ _id: driverId, role: 'driver' });
        
        if (!existingDriver) {
            throw new HttpException('Driver user with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        const scheduleChargers = await this.scheduleChargerModel.find({ userId : driverId });
        let scheduleChargerItems: ScheduleChargerGetAllItemDto[] = [];

        // Create an array of promises
        const promises = scheduleChargers.map(async scheduleCharger => {
            const user = await this.userModel.findOne({ _id: scheduleCharger.driverId, role: 'driver' });
            const charger = await this.chargerModel.findOne({ _id: scheduleCharger.chargerId });
            const appointment = await this.appointmentModel.findOne({ _id: scheduleCharger.appointmentId });
            const vehicle = await this.vehicleModel.findOne({ _id: scheduleCharger.vehicleId });
    
            const item = {
                _id: scheduleCharger._id,
                driverId: user._id,
                driverName: `${user.firstName} ${user.lastName}`,
                chargerId: charger._id,
                location: charger.location,
                appointmentId: appointment._id,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                vehicleId: vehicle._id,
                vehicleModel: vehicle.vehicleModel,
                date: scheduleCharger.date
            };
    
            scheduleChargerItems.push(item);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        return { items: scheduleChargerItems };
    }

    async searchByDriver(query?: string, driverId?: string): Promise<ScheduleChargerSearchDto> {
        const existingDriver = await this.userModel.findOne({ _id: driverId, role: 'driver' });
        
        if (!existingDriver) {
            throw new HttpException('Driver user with this id does not exist.', HttpStatus.BAD_REQUEST);
        }

        let scheduleChargers;
        let scheduleChargerItems: ScheduleChargerGetAllItemDto[] = [];

        if (this.isEmpty(query)) {
            scheduleChargers = await this.scheduleChargerModel.find({ driverId });
        } else {
            const searchCriteria = {
                date: new RegExp(query, 'i'),
                driverId: driverId
            };
            
            scheduleChargers = await this.scheduleChargerModel.find(searchCriteria);
        }

        // Create an array of promises
        const promises = scheduleChargers.map(async scheduleCharger => {
            const user = await this.userModel.findOne({ _id: scheduleCharger.driverId, role: 'driver' });
            const charger = await this.chargerModel.findOne({ _id: scheduleCharger.chargerId });
            const appointment = await this.appointmentModel.findOne({ _id: scheduleCharger.appointmentId });
            const vehicle = await this.vehicleModel.findOne({ _id: scheduleCharger.vehicleId });
    
            const item = {
                _id: scheduleCharger._id,
                driverId: user._id,
                driverName: `${user.firstName} ${user.lastName}`,
                chargerId: charger._id,
                location: charger.location,
                appointmentId: appointment._id,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                vehicleId: vehicle._id,
                vehicleModel: vehicle.vehicleModel,
                date: scheduleCharger.date
            };

            scheduleChargerItems.push(item);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        
        return { items: scheduleChargerItems };
    }

    async finish(scheduleChargerId?: string): Promise<void> {
        // starting a new transaction because at the same time we want to 
        // delete schedule charger entity and create charging history entity
        // if anything goes wrong a whole transaction is reverted back to previous state
        const session = await this.scheduleChargerModel.startSession();
        session.startTransaction();
    
        try {
            const scheduleCharger = await this.scheduleChargerModel.findById(scheduleChargerId).session(session);
            if (!scheduleCharger) {
                throw new HttpException('Schedule charger not found with this id', HttpStatus.BAD_REQUEST);
            }
    
            const charger = await this.chargerModel.findById(scheduleCharger.chargerId).session(session);
            if (!charger) {
                throw new HttpException('Charger not found with this id', HttpStatus.BAD_REQUEST);
            }
    
            const vehicle = await this.vehicleModel.findById(scheduleCharger.vehicleId).session(session);
            if (!vehicle) {
                throw new HttpException('Vehicle not found with this id', HttpStatus.BAD_REQUEST);
            }
    
            const utilizedEnergy = this.calculateUtilizedEnergy(charger.chargingPower, vehicle.batteryCapacity, 2);
    
            const newChargingHistory = {
                date: scheduleCharger.date,
                cost: utilizedEnergy * charger.pricePerKwh,
                paymentMethod: charger.paymentMethod,
                takenEnergy: utilizedEnergy,
                userId: scheduleCharger.driverId,
                chargerId: scheduleCharger.chargerId,
                vehicleId: scheduleCharger.vehicleId,
                appointmentId: scheduleCharger.appointmentId
            };
    
            await new this.chargingHistoryModel(newChargingHistory).save({ session });
    
            await this.scheduleChargerModel.findByIdAndDelete(scheduleChargerId).session(session);
    
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    //#region Helpers

    private isEmpty(value) {
        return (value == undefined || value == null || (typeof value === "string" && value.trim().length === 0));
    }

    private calculateUtilizedEnergy(chargingPower: number, batteryCapacity: number, chargingTime: number, chargingEfficiency: number = 0.9): number {
        const energyDelivered = chargingPower * chargingTime;
        const effectiveEnergyDelivered = energyDelivered * chargingEfficiency;
        return Math.min(effectiveEnergyDelivered, batteryCapacity);
    }

    //#endregion
}