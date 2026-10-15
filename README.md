# 🎆 Full-Stack Task Management API and App
A full stack task manager project with a web page and server, featuring CRUD operations for tasks, JWT authentication, username case insensitivity for login/registration and password cryptography.

## 📚 Tech Stack
Backend - JavaScript for server scripting.

Database - PostgreSQL, use to maintain a relationship between users, their tasks and tasks' statuses.

Frontend - HTML, JavaScript and CSS, for the vanilla web page application and its logic.

bCrypt npm package - for password hashing to keep stored passwords safe.

jsonwebtoken npm package - for handling and maintaining user authentication for requests.

pg npm package - for PostgreSQL database management through JavaScript.

Express.js npm package - made handling server side scripting easier .

CORS npm package - to allow for cross origin request on the frontend.

## 💽 Core Features
User Login, Registration and Logout - Users have to make an account and then login with those credentials to access task CRUD features. Users can also logout after logging in.

CRUD Features for tasks - Allows for users to make, update and delete tasks. These actions are saved in a database, allowing for these actions to be read and shown to a user on the webpage as well. These changes are also maintained even after a user logs out and logs in later.

jsonwebtoken authentication - Use of these token allows for those with only a valid token to access the task CRUD features, keeping unauthenticated users out.

Dropdown status menu for task statuses - using a selection menu makes users select only valid status options when creating or updating a tasks. This provides users with a better UX compared to needing to type out these valid statuses.

Hashed Passwords - Using bcrypt, this application avoids the issue of storing raw user passwords by using bcrypt's salting and hashing, keeping user information secure and safe if something were to happen with the database, such as a database leak.

Session persistence - Allows for users that are logged to stay logged in through the use of 'localstorage'.

## 📋 Prerequisites
Before you begin, ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [PostgreSQL](https://www.postgresql.org/) & pgAdmin
* Git

---

## ⚙️ Installation & Setup

### 1. 📠 Clone the Repository
Open your terminal and clone the project to your local machine:

    bash
    git clone https://github.com/MmwAggie/Task-Management-API
    cd Task-Management-API

### 2. 🎛 Configure Environment Variables
Create a \`.env\` file in the root directory of your backend server and add your configuration details:

    PORT=5000
    JWT_SECRET=your_super_secret_jwt_key_here
    DB_USER=postgres
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=task_manager_db

### 3. 🧮 Set Up the PostgreSQL Database
1. Open pgAdmin or your preferred PostgreSQL terminal client.
2. Create a new database named \`task_manager_db\`:

        CREATE DATABASE task_manager_db;
   
5. Run your table creation scripts (users table, tasks table, foreign key constraints) to initialize your schema.

### 4. ⚙ Install Backend Dependencies
Navigate to your project directory and install the required npm packages:

    bash
    npm install
---

## 🏃‍♂️ Running the Application

### 1. 💾 Start the Backend Server
Start your Express server:

    bash
    npm start

# or if using nodemon:

    npm run dev

*(The server should successfully connect to the database and listen on port 5000).*

### 2. 🚀 Launch the Frontend
1. Open your frontend code folder in your code editor (e.g., VS Code).
2. Use an extension like **Live Server** to launch the project (typically hosted at \`http://127.0.0.1:5500\`).
3. Open your browser, register a new account, log in, and start managing your tasks!

---

## 💻 Challanges and Lessons learned

Many of the challenges I face can be read in the .txt file named "Bugs and Issues.txt". It's a very simple look into the issues I ran into.

In general, I say my biggest challenge was getting the hang of these new tools I used on my end, such as Postman for testing server requests/responses and pgAdmin for database checks. Given my unfamiliarity with these tools a lot of my time went into researching how to use these tools correctly.

Most of the stuff I learned for this project came from learning how to structure server routes, their controllers, implementing helpful middleware and utilizing pooling for for database connections. Learning the logic and reasons for using stuff like this was a major hurdle for me, since I didn't want to just copy and paste things from AI or other projects I found. Overall, I feel like I've developed a much better understanding of how developing a backend works and how to implement it into a frontend.

This was a cool project to do and I learned a lot. A big thanks to Google Gemini for a lot, and I mean A LOT of help and assistance and guidance throughout the whole project.
