import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
    @Prop({ required: true })
    startTime?: string;

    @Prop({ required: true })
    endTime?: string;

    @Prop({ default: false, required: true })
    isAvailable?: boolean;

    @Prop({ default: true, required: true })
    isAllowed?: boolean;
    
    @Prop({ required: true })
    chargerId?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);