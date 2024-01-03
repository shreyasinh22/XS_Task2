const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const { hashPassword, comparePassword } = require('./authhelper');
const { requireSignin } = require('./authMiddleware');
// user model
const User = require('./models/users');

const app = express();

dotenv.config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/contact', requireSignin ,(req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', async (req, res) => {
    // Handle register logic here
    try {
        const { username, email, password} = req.body; // get user input
        // check if all fields are filled
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Please fill in all fields'
            });
        }
        // check user
        const existingUser = await User.findOne({ email });
        // if user exists
        if (existingUser) {
            console.log(`user already exists`)
            return res.status(400).json({
                message: 'user already exists'
            });
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        // create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const result = await newUser.save(); // save user to db
        
        res.status(201).redirect('/login');
    } catch (error) {
        console.log(error); // log the error to the console for debugging 
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
});

// Login route
app.post('/login', async (req, res) => {
    // Handle login logic here
    try {
        const { email, password } = req.body;
        // check if all fields are filled
        if (!email || !password) {
            console.log(`Please fill in all fields`)
            return res.status(400).json({
                message: 'Please fill in all fields'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`user does not exist`)
            return res.status(400).json({
                message: 'user does not exist'
            });
        }
        // compare password
        const match = await comparePassword(password, user.password);

        if (!match) {
            console.log(`password does not match`)
            return res.status(400).json({
                message: 'wrong password'
            });
        }
        // create token
        const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: '1d' });

        res.status(201).json({
            message: 'User login successfully',
            user:{
                name: user.name,
                email: user.email,
            },
            token
        });

    } catch (error) {
        console.log(error); // log the error to the console for debugging 
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Handle logout logic here
    // ...
    res.send('Logout successful');
});

// Contact form submission route
app.post('/contact',requireSignin ,(req, res) => {
    // Handle contact form submission logic here
    // ...
    res.send('Contact form submitted');
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});
