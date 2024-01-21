import express from 'express'
import { User } from '../models/userModel.js';

const router = express.Router();

router.post(`/Add`, async (request, response) => {
    try{
        const { firstName, lastName, username, dateOfBirth, emailAddress, isBlocked, vehicles } = request.body;

        if(!firstName || !lastName || !username || !dateOfBirth || !emailAddress || !isBlocked) {
            return response.status(400).send({ 
                message: "Send all required fields: firstName, lastName, username, dateOfBirth, emailAddress, isBlocked" 
            });
        }

        const newUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            dateOfBirth: dateOfBirth,
            emailAddress: emailAddress,
            isBlocked: isBlocked
        };

        const user = await User.create(newUser);

        return response.status(201).send(user);
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

router.get(`/`, async (request, response) => {
    try{
        const users = await User.find({});
        return response.status(200).json({
            count: users.length,
            data: users
        });
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

router.get(`/:id`, async (request, response) => {
    try{
        const { id } = request.params;

        const user = await User.findById(id);
        return response.status(200).json(user);
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

router.put(`/:id`, async (request, response) => {
    try{
        if(!request.body.firstName || !request.body.lastName || !request.body.username || !request.body.dateOfBirth || !request.body.emailAddress || !request.body.isBlocked) {
            return response.status(400).send({ 
                message: "Send all required fields: firstName, lastName, username, dateOfBirth, emailAddress, isBlocked" 
            });
        }

        const { id } = request.params;

        const result = await User.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(400).json({ message: 'User not found' });
        }
        
        return response.status(200).json({ message: 'User updated successfully' });
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

router.delete(`/:id`, async (request, response) => {
    try{
        const { id } = request.params;

        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return response.status(400).json({ message: 'User not found' });
        }

        return response.status(200).json({ message: 'User deleted successfully' });
    } catch(error) {
        console.log(error.message)
        response.status(500).send({message: error.message });
    }
});

export default router;