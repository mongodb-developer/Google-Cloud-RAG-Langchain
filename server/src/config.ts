import * as dotenv from "dotenv";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

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