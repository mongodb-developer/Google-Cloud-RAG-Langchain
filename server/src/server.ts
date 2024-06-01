import express from "express";
import cors from "cors";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

import { config } from "./config.js";
import { connectToDatabase, collections } from "./database.js";


const app = express();
app.use(cors());

const router = express.Router();
router.use(express.json());

router.get("/", async (_, res) => {
  res.send("Welcome to the Insurance Chatbot API! 🤖");
});

router.post("/messages", async (req, res) => {
  // TODO: Implement /messages POST endpoint
  res.status(501).end();
});


app.use(router);

// start the Express server
app.listen(config.server.port, () => {
  console.log(`Server running on port:${config.server.port}...`);
});
