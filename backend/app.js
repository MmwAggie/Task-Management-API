/*
This will be the main file for the server.
September 4, 2026
Makell Williams
*/
require('dotenv').config();

const user = process.env.DATABASE_USER;

console.log('Database User:', user);