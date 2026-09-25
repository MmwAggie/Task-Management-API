/*
This is where routes functions are defined, allowing for the separation of concerns between route definitions and controller logic.
September 12, 2026
Makell Williams
*/

import bcrypt from 'bcrypt'; // Import the bcrypt module for hashing passwords
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for creating and verifying JWT tokens
import { pool } from '../config/db.js'; // Import the database connection pool from the db.js file

export const registerUser = async (req, res, next) => { // Logic for registering a user, including validation, password hashing, and token generation.
    const { userName, password } = req.body; // Destructure the userName and password from the request body

    if (!userName || !password) { // Check if either the userName or password is missing
        return res.status(400).json({ message: 'Username and Password are required!!!' }); // Return a 400 Bad Request response if either is missing
    }

    try {
        const userExist = await pool.query('SELECT * FROM users WHERE userName = $1', [userName]); // Query the database to check if the user already exists

        if (userExist.rows.length > 0) { // If the user already exists, return a 400 Bad Request response
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(12); // Generate salt for password.
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using bcrypt with a salt

        const newUser = await pool.query( // Create a new user
            'INSERT INTO users (userName, password) VALUES ($1, $2) RETURNING *', // Insert the new user into the database and return the newly created user
            [userName, hashedPassword]
        );

        const token = jwt.sign( // Create a JWT token for the new user
            { id: newUser.rows[0].userID },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ExPIRATION_TIME }
        );

        return res.status(201).json({
            message: 'User is registered!', // Return a 201 Created response with the new user's information and token
            token,
            user: { // Keep these properties lower case since Postgresql defaults to lower case for anything not in quotes, apparently.
                id: newUser.rows[0].userid,
                userName: newUser.rows[0].username
            }
        });
    }
    catch (error) { // Replaced with the global error catcher.
        next(error)
    }
};

export const loginUser = async (req, res, next) => { // Logic for logging in a user, including validation, password comparison, and token generation.
    const { userName, password } = req.body; // Destructure the userName and password from the request body

    if (!userName || !password) { // Check if either the userName or password is missing
        return res.status(400).json({ message: 'Username and Password are required!!!' }); // Return a 400 Bad Request response if either is missing
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE userName = $1', [userName]); // Query the database to find the user by userName
        const user = result.rows[0]; // Get the user from the query result

        if (!user) { // If not found, return a 400 Bad Request response
            return res.status(400).json({ message: 'Invalid Username or Password!' }); // Return a 400 Bad Request response if the user is not found
        }

        const passMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database

        if (!passMatch) { // If the passwords do not match, return a 400 Bad Request response
            return res.status(400).json({ message: 'Invalid Username or Password!' }); // Return a 400 Bad Request response if the password does not match
        }

        const token = jwt.sign( // Generate a JWT token for the authenticated user
            { id: user.userid },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION_TIME }
        );

        return res.status(200).json({
            message: 'User logged in successfully!', // Return a 200 OK response with the user's information and token
            token,
            user: {
                id: user.userid,
                userName: user.username
            }
        });
    }
    catch (error) { // Replaced with the global error catcher.
        next(error);
    }
};