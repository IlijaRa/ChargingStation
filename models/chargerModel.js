const mongoose = require('mongoose');

const chargerSchema = mongoose.Schema(
    {
        chargingPower: {
            type: Number,
            required: true
        },
        connectorType: {
            type: String,
            required: true
        },
        // voltage: {
        //     type: String,
        //     required: false
        // },
        pricePerKwh: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        isAvailable: {
            type: Boolean,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Charger', chargerSchema);