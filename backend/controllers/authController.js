/*
This is where routes functions are defined, allowing for the separation of concerns between route definitions and controller logic.
September 12, 2026
Makell Williams
*/

import bcrypt from 'bcrypt'; // Import the bcrypt module for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for creating and verifying JWT tokens
import { pool } from './config/db.js'; // Import the database connection pool from the db.js file

exports.registerUser = async (req, res) => { // Logic for registering a user, including validation, password hashing, and token generation.
    const { username, password } = req.body; // Destructure the username and password from the request body

    if (!email || !password) { // Check if either the username or password is missing
        return res.status(400).json({ message: 'Username and password are required' }); // Return a 400 Bad Request response if either is missing
    }

    try {
        const userExist = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // Query the database to check if the user already exists

        if (userExist.rows.length > 0) { // If the user already exists, return a 400 Bad Request response
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = bcrypt.genSalt(12); // Generate salt for password.
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using bcrypt with a salt

        const newUser = await pool.query( // Create a new user
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', // Insert the new user into the database and return the newly created user
            [username, hashedPassword]
        );

        const token = jwt.sign( // Create a JWT token for the new user
            { id: newUser.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ExPIRATION_TIME }
        );

        return res.status(201).json({
            message: 'User is registered!', // Return a 201 Created response with the new user's information and token
            token,
            user: { username: newUser.rows[0].username }
        });
    }
    catch (error) { // Catch any errors that occur during the registration process
        console.error('Error registering user:', error); // Log the error to the console for debugging
        return res.status(500).json({ message: "Internal server error" }); // Return a 500 Internal Server Error response if something goes wrong
    }
};

exports.loginUser = async (req, res) => { // Logic for logging in a user, including validation, password comparison, and token generation.
    const { username, password } = req.body; // Destructure the username and password from the request body

    if (!username || !password) { // Check if either the username or password is missing
        return res.status(400).json({ message: 'Username and password are required' }); // Return a 400 Bad Request response if either is missing
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // Query the database to find the user by username
        const user = result.rows[0]; // Get the user from the query result

        if (!user) { // If not found, return a 400 Bad Request response
            return res.status(400).json({ message: 'Invalid username or password' }); // Return a 400 Bad Request response if the user is not found
        }

        const passMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database

        if (!passMatch) { // If the passwords do not match, return a 400 Bad Request response
            return res.status(400).json({ message: 'Invalid username or password' }); // Return a 400 Bad Request response if the password does not match
        }

        const token = jwt.sign( // Generate a JWT token for the authenticated user
            { id: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ExPIRATION_TIME }
        );

        return res.status(200).json({
            message: 'User logged in successfully!', // Return a 200 OK response with the user's information and token
            token,
            user: { username: user.username }
        });
    }
    catch (error) { // Catch any errors that occur during the login process
        console.error('Error logging in user:', error); // Log the error to the console for debugging
        return res.status(500).json({ message: "Internal server error" }); // Return a 500 Internal Server Error response if something goes wrong
    }
};