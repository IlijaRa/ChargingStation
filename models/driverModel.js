import mongoose from 'mongoose';
import { Vehicle } from './vehicleModel.js'
import { User } from './userModel.js';

const driverSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        vehicles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true
        }]
    },
    {
        timestamps: true
    }
)

export const Driver = User.discriminator('Driver', driverSchema);