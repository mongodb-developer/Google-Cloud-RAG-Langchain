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
    const client = new MongoClient(uri, { appName: 'devrel.googlecloud.rag' });
    await client.connect();

    const db = client.db(config.mongodb.dbName);

    const contextCollection = db.collection<Context>(config.mongodb.contextCollection);
    collections.context = contextCollection;

    return collections;
}
