const express = require('express');
const chargerRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const jwt = require('jsonwebtoken');
const Charger = require('../models/chargerModel');
const User = require('../models/userModel');

chargerRouter.get(`/getall`, passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { username, role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const chargers = await Charger.find({});

        return response.status(200).json({ message: { msgBody: { count: chargers.length, data: chargers }, msgError: false } });
    } catch(error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while getting chargers: ${error.message}`, msgError: true } });
    }
});

chargerRouter.get(`/getbyid/:id`, passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { id } = request.params;
        const { username, role } = request.user;

        if (role !== 'driver' && role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        const charger = await Charger.findOne({ _id: id });

        if (!charger) {
            return response.status(400).json({ message: { msgBody: `Charger not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: { data: charger }, msgError: false } });
    } catch(error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while getting the charger: ${error.message}`, msgError: true } });
    }
});

chargerRouter.post('/add', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try {
        const { role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: "Forbidden action", msgError: true } });
        }

        // const { chargingPower, connectorType, voltage, pricePerKwh, paymentMethod, isAvailable, latitude, longitude, appointments } = request.body;

        const newCharger = new Charger(request.body);

        await newCharger.save().then(() => {
            return response.status(201).json({ message: { msgBody: `Charger successfully added.`, msgError: false } });
        }).catch((error) => {
            response.status(500).json({ message: { msgBody: `Error has occurred while adding the charger: ${error}`, msgError: true } });
        });

    } catch (error) {
        console.log(error.message)
        response.status(500).json({ message: { msgBody: `Error has occurred while adding the charger: ${error.message}`, msgError: true } });
    }
});

chargerRouter.put('/update/:id', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try {
        const { role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: `Forbidden action`, msgError: true } });
        }

        const { id } = request.params;
        const result = await Charger.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(400).json({ message: { msgBody: `Charger not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: `Charger successfully updated.`, msgError: false } });
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({ message: { msgBody: `Error has occurred while updating the charger: ${error.message}`, msgError: true } });
    }
});

chargerRouter.delete('/delete/:id', passport.authenticate('jwt', { session: false }), async (request, response) => {
    try{
        const { role } = request.user;

        if (role !== 'admin') {
            return response.status(403).json({ message: { msgBody: `Forbidden action`, msgError: true } });
        }

        const { id } = request.params;
        const result = await Charger.findByIdAndDelete(id);

        if (!result) {
            return response.status(400).json({ message: { msgBody: `Charger not found`, msgError: true } });
        }

        return response.status(200).json({ message: { msgBody: `Charger successfully deleted.`, msgError: false } });
    } catch(error) {
        console.log(error.message)
        return response.status(500).json({ message: { msgBody: `Error has occurred while deleting the charger: ${error.message}`, msgError: true } });
    }
});

module.exports = chargerRouter;