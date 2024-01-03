const mongoose = require('mongoose');

const UserSch = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Enter your username'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        trim: true,
        unique: true,
        maxlength: [50, 'Email cannot be more than 50 characters']
    },
    password: {
        type: String,
        required: [true, 'Enter your password'],
        // minlength: [6, 'Password cannot be less than 6 characters']
    },
}, {
    timestamps: true
})

const User = mongoose.model('Users_test', UserSch);
//export the model
module.exports = User;