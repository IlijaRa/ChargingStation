const mongoose = require('mongoose');

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
        // year: {
        //     type: Number,
        //     required: true
        // },
        // color: {
        //     type: String,
        //     required: true
        // },
        batteryCapacity: {
            type: Number,
            required: true
        },
        chargerType: {
        },
        // fuelType: {
        //     type: String,
        //     required: true
        // },
        // mileage: {
        //     type: Number,
        //     required: true
        // },
        // regenerativeBraking: {
        //     type: Boolean,
        //     required: false
        // },
        username: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Vehicle', vehicleSchema);