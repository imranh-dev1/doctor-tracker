import { MongoClient } from 'mongodb';
import config from '../config';

const client = new MongoClient(config.database_url);

export async function connectToMongoDB() {
    try {
        await client.connect();
        // console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

export async function disconnectFromMongoDB() {
    await client.close();
}