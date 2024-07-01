import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleChargersController } from "src/controllers";
import { Appointment, AppointmentSchema, Charger, ChargerSchema, ChargingHistory, ChargingHistorySchema, ScheduleCharger, ScheduleChargerSchema, User, UserSchema, Vehicle, VehicleSchema } from "src/schemas";
import { ScheduleChargersService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ScheduleCharger.name, schema: ScheduleChargerSchema },
            { name: User.name, schema: UserSchema },
            { name: Charger.name, schema: ChargerSchema },
            { name: Vehicle.name, schema: VehicleSchema },
            { name: Appointment.name, schema: AppointmentSchema },
            { name: ChargingHistory.name, schema: ChargingHistorySchema }
        ])
    ],
    providers: [ScheduleChargersService],
    controllers: [ScheduleChargersController]
})
export class ScheduleChargersModule { }