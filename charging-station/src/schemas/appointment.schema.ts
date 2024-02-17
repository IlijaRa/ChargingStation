import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
    @Prop({ required: true })
    startTime?: string;

    @Prop({ required: true })
    endTime?: string;

    @Prop({ required: true })
    chargerId?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);