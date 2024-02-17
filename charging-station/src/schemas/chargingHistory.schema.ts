import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChargingHistory extends Document {
    @Prop({ required: true })
    startDate?: Date;

    @Prop({ required: true })
    endDate?: Date;

    @Prop({ required: true })
    cost?: Number;

    @Prop({ required: true })
    takenEnergy?: Number;

    @Prop({ required: true })
    userId?: string;

    @Prop({ required: true })
    chargerId?: string;
}

export const ChargingHistorySchema = SchemaFactory.createForClass(ChargingHistory);