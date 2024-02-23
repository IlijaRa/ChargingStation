import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Appointment, AppointmentSchema } from "src/schemas";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Appointment.name,
            schema: AppointmentSchema
        }])
    ]
})
export class AppointmentsModule {

}