import express from 'express';
import { Driver } from '../models/driverModel.js';

const router = express.Router();

router.post(`/Add`, async (request, response) => {
    try {
        // Extract user details from request body
        const { firstName, lastName, username, dateOfBirth, emailAddress, isBlocked, vehicles } = request.body;

        // Check if required fields are present
        if (!firstName || !lastName || !username || !dateOfBirth || !emailAddress || !isBlocked || !vehicles) {
            return response.status(400).send({ 
                message: "Send all required fields: firstName, lastName, username, dateOfBirth, emailAddress, isBlocked, vehicles" 
            });
        }

        // Create a new user object
        const newUser = {
            firstName,
            lastName,
            username,
            dateOfBirth,
            emailAddress,
            isBlocked,
        };

        // Create a new user with the base user details
        const createdUser = await User.create(newUser);

        // Extract the user ID from the created user
        const userId = createdUser._id;

        // Create a new driver object with the user ID and associated vehicles
        const newDriver = {
            _id: userId,
            vehicles: vehicles.map(vehicle => new Vehicle(vehicle))
        };

        // Create the driver
        const createdDriver = await Driver.create(newDriver);

        return response.status(201).send(createdDriver);
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message });
    }
});

// router.get(`/`, async (request, response) => {
//     try{
//         const users = await User.find({});
//         return response.status(200).json({
//             count: users.length,
//             data: users
//         });
//     } catch(error) {
//         console.log(error.message)
//         response.status(500).send({message: error.message });
//     }
// });

// router.get(`/:id`, async (request, response) => {
//     try{
//         const { id } = request.params;

//         const user = await User.findById(id);
//         return response.status(200).json(user);
//     } catch(error) {
//         console.log(error.message)
//         response.status(500).send({message: error.message });
//     }
// });

// router.put(`/:id`, async (request, response) => {
//     try{
//         if(!request.body.firstName || !request.body.lastName || !request.body.username || !request.body.dateOfBirth || !request.body.emailAddress || !request.body.isBlocked) {
//             return response.status(400).send({ 
//                 message: "Send all required fields: firstName, lastName, username, dateOfBirth, emailAddress, isBlocked" 
//             });
//         }

//         const { id } = request.params;

//         const result = await User.findByIdAndUpdate(id, request.body);

//         if (!result) {
//             return response.status(400).json({ message: 'User not found' });
//         }
        
//         return response.status(200).json({ message: 'User updated successfully' });
//     } catch(error) {
//         console.log(error.message)
//         response.status(500).send({message: error.message });
//     }
// });

// router.delete(`/:id`, async (request, response) => {
//     try{
//         const { id } = request.params;

//         const result = await User.findByIdAndDelete(id);

//         if (!result) {
//             return response.status(400).json({ message: 'User not found' });
//         }

//         return response.status(200).json({ message: 'User deleted successfully' });
//     } catch(error) {
//         console.log(error.message)
//         response.status(500).send({message: error.message });
//     }
// });

export default router;