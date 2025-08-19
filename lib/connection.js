import mongoose from "mongoose";

let isConnected = false;

export async function dbConnect() {
    if (isConnected) {
        console.log("Already connected to the database");
        return;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

export function getMongooseConnection() {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
        throw new Error("Database connection not established yet");
    }
    return mongoose.connection;
}