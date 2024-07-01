import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChargingHistoriesController } from "src/controllers";
import { Appointment, AppointmentSchema, Charger, ChargerSchema, ChargingHistory, ChargingHistorySchema, User, UserSchema, Vehicle, VehicleSchema } from "src/schemas";
import { ChargingHistoriesService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ChargingHistory.name, schema: ChargingHistorySchema },
            { name: User.name, schema: UserSchema },
            { name: Vehicle.name, schema: VehicleSchema },
            { name: Appointment.name, schema: AppointmentSchema },
            { name: Charger.name, schema: ChargerSchema }
        ])
    ],
    providers: [ChargingHistoriesService],
    controllers: [ChargingHistoriesController]
})
export class ChargingHistoriesModule { }