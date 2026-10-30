import { MongoClient } from "mongodb";
import config from "../config";

const client = new MongoClient(config.database_url);

export async function connectToMongoDB() {
    try {
        await client.connect();
        await client.db().command({ ping: 1 });

        return client;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

export function getDatabase() {
    return client.db("doctor-tracker");
}

export async function disconnectFromMongoDB() {
    await client.close();
    console.log("MongoDB disconnected successfully!");
}