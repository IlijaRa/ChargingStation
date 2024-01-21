import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
    {
        fromDate: {
            type: Date,
            required: true
        },
        fromTime: {
            type: String,
            required: true
        },
        toDate: {
            type: Date,
            required: true
        },
        toTime: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

export const Appointment = mongoose.model('Appointment', appointmentSchema);