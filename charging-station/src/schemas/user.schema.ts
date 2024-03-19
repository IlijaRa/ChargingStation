import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    firstName?: string;

    @Prop({ required: true })
    lastName?: string;

    @Prop({ required: true })
    dateOfBirth?: Date;

    @Prop({ required: true })
    biography?: string;

    @Prop({ unique: true, required: true })
    username?: string;

    @Prop({ unique: true, required: true })
    emailAddress?: string;

    @Prop({ required: true })
    password?: string;

    @Prop({ required: true })
    role?: string;

    @Prop({ required: true })
    gender?: string;

    @Prop({ default: false, required: true })
    isBlocked?: boolean;

    @Prop({ default: false, required: true })
    isConfirmed?: boolean;

    @Prop()
    refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);