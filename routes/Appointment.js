const express = require('express');
const appointmentRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointmentModel');
const Charger = require('../models/chargerModel');

appointmentRouter.get(`/getall/:chargerId`, passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { chargerId } = request.params;
        const { username, role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const appointments = await Appointment.find({ chargerId });

        return response.status(200).json({ message: { msgBody: { count: appointments.length, data: appointments }, msgError: false } });
    } catch(error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while getting appointments: ${error.message}`, msgError: true } });
    }
});

appointmentRouter.get(`/getbyid/:chargerId/:appointmentId`, passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { chargerId, appointmentId } = request.params;
        const { username, role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const appointment = await Appointment.findOne({ _id: appointmentId, chargerId });

        if (!appointment) {
            return response.status(400).json({ message: { msgBody: `Appointment not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: { data: appointment }, msgError: false } });
    } catch(error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while getting the appointment: ${error.message}`, msgError: true } });
    }
});

appointmentRouter.post('/add/:chargerId', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try {
        const { chargerId } = request.params;
        const { role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const { fromDate, fromTime, toDate, toTime } = request.body;
        const charger = await Charger.findOne({ _id: chargerId });

        if (!charger) {
            return response.status(400).json({ message: { msgBody: `Charger not found`, msgError: true } });
        }

        const newAppointment = new Appointment({ fromDate, fromTime, toDate, toTime, chargerId });

        await newAppointment.save().then(() => {
            return response.status(201).json({ message: { msgBody: `Appointment successfully added.`, msgError: false } });
        }).catch((error) => {
            response.status(500).json({ message: { msgBody: `Error has occurred while adding the appointment: ${error}`, msgError: true } });
        });

    } catch (error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while adding the appointment: ${error.message}`, msgError: true } });
    }
});

appointmentRouter.put('/update/:id', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try {
        const { role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: `Forbidden action`, msgError: true } });
        }

        const { id } = request.params;

        const result = await Appointment.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(400).json({ message: { msgBody: `Appointment not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: `Appointment successfully updated.`, msgError: false } });
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({ message: { msgBody: `Error has occurred while updating the appointment: ${error.message}`, msgError: true } });
    }
});

appointmentRouter.delete('/delete/:id', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: `Forbidden action`, msgError: true } });
        }
        
        const { id } = request.params;

        const result = await Appointment.findByIdAndDelete(id);

        if (!result) {
            return response.status(400).json({ message: { msgBody: `Appointment not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: `Appointment successfully deleted.`, msgError: false } });
    } catch(error) {
        console.log(error.message)
        return response.status(500).json({ message: { msgBody: `Error has occurred while deleting the appointment: ${error.message}`, msgError: true } });
    }
});

module.exports = appointmentRouter;