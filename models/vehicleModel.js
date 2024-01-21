import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema(
    {
        manufacturer: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        batteryCapacity: {
            type: Number,
            required: true
        },
        chargingTime: {
            type: Number,
            required: true
        },
        fuelType: {
            type: String,
            required: true
        },
        mileage: {
            type: Number,
            required: true
        },
        regenerativeBraking: {
            type: Boolean,
            required: false
        }
    },
    {
        timestamps: true
    }
)

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);