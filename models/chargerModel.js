const mongoose = require('mongoose');
const Appointment = require('./appointmentModel');

const chargerSchema = mongoose.Schema(
    {
        power: {
            type: Number,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        pricePerKwh: {
            type: Number,
            required: true
        },
        isTaken: {
            type: Boolean,
            required: true
        },
        appointments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true
        }],
        mileage: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Charger', chargerSchema);
// export const Charger = mongoose.model('Charger', chargerSchema);