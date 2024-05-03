import { MongoClient, Collection } from "mongodb";

import { config } from "./config.js";

interface Context {
    textChunk: string;
    vectorEmbedding: number[];
    metadata: any;
}

export const collections: {
    context?: Collection<Context>;
} = {};

export async function connectToDatabase(uri = config.mongodb.uri) {
    // TODO: Implement connect to MongoDB Atlas database
}
