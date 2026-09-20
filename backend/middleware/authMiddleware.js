/*
This will be my verifier for people using this application. It checks and ensures that users are who they say they are before making task.
Kind of like a security guard for this app's task functions, only a verified user can get by and interact with these functions.
September 20, 2026
Makell Williams
*/

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => { // Exported function that will be used to verify a user before allowing task manipulation.
    const authHeader = req.headers['authorization']; // Get header from user request. Authorization header is checked specifically.

    const token = authHeader && authHeader.split(' ')[1]; // Split the header up, get the token needed to verify the user.
    // I think the token is 'Bearer <token>', so I split it to 'Bearer' and '<token>'. Get the [1] element in the split array, which is the token needed for verification.

    if (!token) { // If no token is found, user is denied access.
        return res.status(401).json({
            message: "Access denied. Token was not provided!"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Try to decode the token to verify it.

        req.userID = decodedToken.id; // Get user id from the decoded token. Attach to user request object.

        next(); // Then move on to the next controller function.
    }

    catch (error) { // Typical error catcher for the try above.
        return res.status(403).json({
            message: 'Token is expried or invalid.'
        });
    }
}

