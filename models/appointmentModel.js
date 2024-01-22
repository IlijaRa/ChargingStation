const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        fromTime: {
            type: String,
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