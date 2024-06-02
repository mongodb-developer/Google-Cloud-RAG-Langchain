import * as dotenv from "dotenv";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

export const config = {
    mongodb: {
        uri: ATLAS_URI,
        dbName: "chat-rag",
        contextCollection: "context",
    },
    server: {
        port: 8080,
    },
}
