import mongoose from 'mongoose';
import { User } from './userModel.js';

const adminSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Admin = User.discriminator('Admin', adminSchema);