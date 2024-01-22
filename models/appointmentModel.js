const mongoose = require('mongoose');

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
        },
        chargerId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Appointment', appointmentSchema);
// export const Appointment = mongoose.model('Appointment', appointmentSchema);