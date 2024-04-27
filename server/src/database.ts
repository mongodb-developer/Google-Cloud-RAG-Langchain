import { MongoClient, Collection } from "mongodb";
import { config } from "./config";

interface Message {
  text: string;
  timestamp: Date;
}

interface Context {
  textChunk: string;
  vectorEmbedding: number[];
  metadata: any;
}

export const collections: {
    messages?: Collection<Message>;
    context?: Collection<Context>;
} = {};


export async function connectToDatabase(uri = config.mongodb.uri) {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(config.mongodb.dbName);

  const messagesCollection = db.collection<Message>(config.mongodb.messagesCollection);
  collections.messages = messagesCollection;

  const contextCollection = db.collection<Context>(config.mongodb.contextCollection);
  collections.context = contextCollection;

  return collections;
}
