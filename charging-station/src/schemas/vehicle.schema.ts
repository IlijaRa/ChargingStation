import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Vehicle extends Document {
    @Prop({ required: true })
    manufacturer?: string;

    @Prop({ required: true })
    vehicleModel?: string;

    @Prop({ required: true })
    batteryCapacity?: number;

    @Prop({ required: true })
    chargingProtocol?: string;

    @Prop({ required: true })
    userId?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);