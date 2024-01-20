import mangoose from 'mongoose';

const vehicleSchema = mangoose.Schema(
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
        fuelType: {
            type: String,
            required: true
        },
        mileage: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Vehicle = mangoose.model('Vehicle', vehicleSchema);