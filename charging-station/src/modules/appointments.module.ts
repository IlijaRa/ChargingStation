import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppointmentsController } from "src/controllers";
import { Appointment, AppointmentSchema, ChargingHistory, ChargingHistorySchema, ScheduleCharger, ScheduleChargerSchema } from "src/schemas";
import { AppointmentsService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Appointment.name, schema: AppointmentSchema },
            { name: ChargingHistory.name, schema: ChargingHistorySchema },
            { name: ScheduleCharger.name, schema: ScheduleChargerSchema },
        ])
    ],
    providers: [AppointmentsService],
    controllers: [AppointmentsController]
})
export class AppointmentsModule {

}