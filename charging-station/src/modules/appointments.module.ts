import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppointmentsController } from "src/controllers";
import { Appointment, AppointmentSchema } from "src/schemas";
import { AppointmentsService } from "src/services";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Appointment.name,
            schema: AppointmentSchema
        }])
    ],
    providers: [AppointmentsService],
    controllers: [AppointmentsController]
})
export class AppointmentsModule {

}