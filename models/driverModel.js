import mangoose from 'mongoose';
import { Vehicle } from './vehicleModel'

const driverSchema = mangoose.Schema(
    {
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

export const Driver = mangoose.model('Driver', driverSchema);