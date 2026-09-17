/*
This is where the task controllers are called as they are needed for each route.
September 17, 2026
Makell Williams
*/

import express from 'express'; // Import the express module for creating the server
const router = express.Router(); // Create a new router instance to define our routes

import { createTask, getTask, deleteTask, updateTask } from '../controllers/taskControllers.js'; // Import the controller functions for user registration and login


router.post('/', postTask); // Defines the route for task creation for a user. Mapped to the postTask function.


export default router;