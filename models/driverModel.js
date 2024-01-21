import mongoose from 'mongoose';
import { User } from './userModel.js';

const DriverSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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

module.exports = mongoose.model('Driver', DriverSchema)
// export const Driver = User.discriminator('Driver', driverSchema);