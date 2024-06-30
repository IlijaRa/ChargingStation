import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleChargersController } from "src/controllers";
import { Appointment, AppointmentSchema, Charger, ChargerSchema, ScheduleCharger, ScheduleChargerSchema, User, UserSchema } from "src/schemas";
import { ScheduleChargersService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ScheduleCharger.name, schema: ScheduleChargerSchema },
            { name: User.name, schema: UserSchema },
            { name: Charger.name, schema: ChargerSchema },
            { name: Appointment.name, schema: AppointmentSchema },
        ])
    ],
    providers: [ScheduleChargersService],
    controllers: [ScheduleChargersController]
})
export class ScheduleChargersModule {

}