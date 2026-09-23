/*
Global error handling middleware, should make things easier when stuff isn't found by preventing crashes and hanging.
September 23, 2026
Makell Williams
*/

export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Essentailly, an if else to see if a status code for the error was made. If not, it's 500 now.

    console.error(`[AN ERROR OCCURED!]\nMETHOD: ${req.method}\nURL: ${req.url}\n`, err.message); // Show the error, its method, the url of the request and an error message in the console.

    res.status(statusCode).json({ // Respond with the appropriate info.
        status: 'error', // Error status because an error happened.
        message: err.message || 'Internal Server Error occurred', // Either the error message or say an internal server error happened.
        // DEVELOPMENT ONLY BELOW WITH STACK
        stack: process.env.NODE_ENV === 'development' ? err.stack : null // See what went wrong in the stack of the app, helps make finding issues easier.
    });
}

