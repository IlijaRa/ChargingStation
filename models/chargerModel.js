import mongoose from 'mongoose';
import { Appointment } from './appointmentModel';

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

export const Charger = mongoose.model('Charger', chargerSchema);