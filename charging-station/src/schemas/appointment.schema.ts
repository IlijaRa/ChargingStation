import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
    @Prop({ required: true })
    startDate?: string;

    @Prop({ required: true })
    endDate?: string;

    @Prop({ default: false, required: true })
    isAvailable?: boolean;
    
    @Prop({ required: true })
    chargerId?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);