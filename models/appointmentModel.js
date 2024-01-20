import mangoose from 'mongoose';

const appointmentSchema = mangoose.Schema(
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

export const Appointment = mangoose.model('Appointment', appointmentSchema);