import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, Collection } from "mongodb";
import { config } from "./config";

interface Message {
  _id: ObjectId;
  message: string;
  timestamp: Date;
}

interface Context {
  _id: ObjectId;
  textChunk: string;
  vectorEmbedding: number[];
  metadata: any;
}

const router = express.Router();
router.use(express.json());

router.post("/messages", (req, res) => {
  const message = req.body.text;
  console.log(message);
  res.send({ message: "Hello, world!" });
});

connectToDatabase(config.mongodb.uri)
  .then((collections) => {
    const app = express();
    app.use(cors());

    app.use(router);

    // start the Express server
    app.listen(config.server.port, () => {
      console.log(`Server running at http://localhost:${config.server.port}...`);
    });
  })
  .catch((error) => console.error(error));



async function connectToDatabase(uri: string) {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(config.mongodb.dbName);

  const collections: {
    messages?: Collection<Message>;
    context?: Collection<Context>;
  } = {};

  const messagesCollection = db.collection<Message>(config.mongodb.messagesCollection);
  collections.messages = messagesCollection;

  const contextCollection = db.collection<Context>(config.mongodb.contextCollection);
  collections.context = contextCollection;

  return collections;
}

