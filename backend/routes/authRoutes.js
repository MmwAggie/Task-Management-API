/*
This will be where the url routes are mapped to the correct controller functions, that way routes can be easily managed and maintained in one place. 
September 12, 2026
Makell Williams
*/

import express from 'express'; // Import the express module for creating the server
const router = express.Router(); // Create a new router instance to define our routes

import { registerUser, loginUser } from '../controllers/authController.js'; // Import the controller functions for user registration and login

router.post('/register', registerUser); // Defines the route for user registration, mapping it to the registerUser controller function

router.post('/login', loginUser); // Defines the route for user login, mapping it to the loginUser controller function

export default router; // Export the router instance to be used in other parts of the application