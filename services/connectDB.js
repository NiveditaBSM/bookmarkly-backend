const mongoose = require("mongoose");
const config = require('../utils/config')

let isConnected; // Track the connection state

async function connectDB() {
    if (isConnected) {
        console.log("=> Using existing database connection");
        return;
    }

    try {
        console.log("Trying to connect to MongoDB")
        const db = await mongoose.connect(config.MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log("=> Connected to database");
    } catch (err) {
        console.error("=> Database connection failed:", err);
        process.exit(1); // Exit the process if the connection fails
    }
}

module.exports = connectDB;
