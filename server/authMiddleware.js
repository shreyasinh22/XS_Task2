const jwt = require('jsonwebtoken');
const User = require('./models/users');

//protect routes
const requireSignin = async (req, res, next) => {
    try {
        const token = req.headers.authorization; // get token from header
        const decodedToken = jwt.verify(token, "secret_key"); // decode token, its not a promise
        const user = await userModel.findById(decodedToken.id); // find user by id
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
        } 
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Not authorized'
        });
    }
}

module.exports = {
    requireSignin
};