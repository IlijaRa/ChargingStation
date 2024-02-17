import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Charger extends Document {
    @Prop({ required: true })
    chargingPower?: number;

    @Prop({ required: true })
    chargingProtocol?: string;

    @Prop({ required: true })
    pricePerKwh?: number;

    @Prop({ required: true })
    paymentMethod?: string;

    @Prop({ required: true })
    isAvailable?: boolean;

    @Prop({ required: true })
    latitude?: number;

    @Prop({ required: true })
    longitude?: number;
}

export const ChargerSchema = SchemaFactory.createForClass(Charger);