import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountsController, UsersController } from "src/controllers";
import { Appointment, AppointmentSchema, Charger, ChargerSchema, ChargingHistory, ChargingHistorySchema, User, UserSchema, Vehicle, VehicleSchema } from "src/schemas";
import { AccountsService, ChargingHistoriesService, UsersService } from "src/services"

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Charger.name, schema: ChargerSchema },
            { name: ChargingHistory.name, schema: ChargingHistorySchema },
            { name: User.name, schema: UserSchema },
            { name: Appointment.name, schema: AppointmentSchema },
            { name: Vehicle.name, schema: VehicleSchema },
        ])
    ],
    providers: [
        AccountsService, 
        UsersService, 
        ChargingHistoriesService
    ],
    controllers: [AccountsController, UsersController]
})
export class UsersModule {

}