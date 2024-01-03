const mongoose = require('mongoose');

MONGO_URL = "mongodb+srv://notes:notes@cluster6.9pjud65.mongodb.net/"
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB; // export the function