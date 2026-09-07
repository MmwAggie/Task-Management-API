/*
This file will server as the connection script between the server and the database.
September 6, 2026
Makell Williams
*/

import dotenv from 'dotenv'; // Import the dotenv module to load environment variables
import pg from 'pg'; // Import the pg module for PostgreSQL database interaction

dotenv.config(); // Load environment variables from the .env file

const { Pool } = pg; // Destructure the Pool class from the pg module

console.log("User is:", process.env.DB_USER);
console.log("Host is:", process.env.DB_HOST);
console.log("Database is:", process.env.DB_NAME);
console.log("Password is:", process.env.DB_PASSWORD);
console.log("Port is:", process.env.DB_PORT);


const pool = new Pool ({ // Pool class with database connection configuration
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10)
});

pool.on('connect', () => { // Event listener for successful connection
    console.log("Connection to database was successful!")
});

pool.on('error', (err) => {
    console.error("Error connecting to the database:", err);
    process.exit(-1);
})

const client = await pool.connect(); // Create a client instance from the pool for executing queries
const res = await client.query('SELECT NOW()'); // Execute a simple query to test the connection
console.log("Database connection test result:", res.rows[0]); // Log the result of the test query

export { pool }; // Export the pool instances for use in other parts of the application
