import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ScheduleCharger extends Document {
    @Prop({ required: true })
    driverId?: string;

    @Prop({ required: true })
    chargerId?: string;

    @Prop({ required: true })
    appointmentId?: string;

    @Prop({ required: true })
    vehicleId?: string;

    @Prop({ required: true })
    date?: string;
}

export const ScheduleChargerSchema = SchemaFactory.createForClass(ScheduleCharger);