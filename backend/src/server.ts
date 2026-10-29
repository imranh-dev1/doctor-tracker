
import "dotenv/config";

import app from "./app.js";
import config from "./config/index.js";
import { connectToMongoDB, disconnectFromMongoDB } from "./lib/db.js";

const port = Number(config.port ?? 5000);

const main = async () => {
    try {
        await connectToMongoDB();
        console.log("Connected to the database successfully.");

        app.listen(port, () => {
            console.log(`Server is running on port: http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Error starting the server:", error);
        await disconnectFromMongoDB();
        process.exit(1);
    }
};

main();