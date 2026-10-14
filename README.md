# Full-Stack Task Management API and App
A simple project containing an API and web page application for a task manager. Allows users to register and login to the application and then create, delete and update tasks they make. The goal of the project is to make a simple, yet intuitive application for the frontend while having straightforward and safe backend logic.

## Challanges and Lessons learned

Many of the challenges I face can be read in the .txt file named "Bugs and Issues.txt". It's a very simple look into the issues I ran into.

In general, I say my biggest challenge was getting the hang of these new tools I used on my end, such as Postman for testing server requests/responses and pgAdmin for database checks. Given my unfamiliarity with these tools a lot of my time went into researching how to use these tools correctly.

INSERT ABOUT LEARNING HERE

## Tech Stack
Backend - JavaScript with Node.js, for server scripting.

Database - PostgreSQL, use to maintain a relationship between users, their tasks and tasks' statuses.

Frontend - HTML, JavaScript and CSS, for the vanilla web page application and its logic.

bCrypt npm package - for password hashing to keep stored passwords safe.

jsonwebtoken npm package - for handling and maintaining user authentication for requests.

pg npm package - for PostgreSQL database management through JavaScript.

Express.js npm package - made handling server side scripting easier .

CORS npm package - to allow for cross origin request on the frontend.

## Core Features
User Login, Registration and Logout - Users have to make an account and then login with those credentials to access task CRUD features. Users can also logout after logging in.

CRUD Features for tasks - Allows for users to make, update and delete tasks. These actions are saved in a database, allowing for these actions to be read and shown to a user on the webpage as well. These changes are also maintained even after a user logs out and logs in later.

jsonwebtoken authentication - Use of these token allows for those with only a valid token to access the task CRUD features, keeping unauthenticated users out.

Dropdown status menu for task statuses - using a selection menu makes users select only valid status options when creating or updating a tasks. This provides users with a better UX compared to needing to type out these valid statuses.

##
