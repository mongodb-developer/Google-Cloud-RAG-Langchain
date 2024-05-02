import express from "express";
import cors from "cors";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

import { config } from "./config.js";
import { connectToDatabase, collections } from "./database.js";

await connectToDatabase();

// Initialize the conversational Vertex AI model
const model = new ChatVertexAI({
  // We will use the Gemini 1.0 Pro model
  model: "gemini-1.0-pro",
  // The maximum number of tokens to generate in the response
  maxOutputTokens: 2048,
  // The temperature parameter controls the randomness of the output — the higher the value, the more random the output
  temperature: 0.5,
  // The topP parameter controls the diversity of the output — the higher the value, the more diverse the output
  topP: 0.9,
  // The topK parameter controls the diversity of the output — the higher the value, the more diverse the output
  topK: 20,
});

// Connect to the MongoDB Atlas vector store
const vectorStore = new MongoDBAtlasVectorSearch(
  // Google Cloud Vertex AI's text embeddings model will be used for vectorizing the text chunks
  new GoogleVertexAIEmbeddings(),
  {
    collection: collections.context as any,
    // The name of the Atlas Vector Search index. You must create this in the Atlas UI.
    indexName: "default",
    // The name of the collection field containing the raw content. Defaults to "text"
    textKey: "text",
    // The name of the collection field containing the embedded text. Defaults to "embedding"
    embeddingKey: "embedding",
  }
);

// Initialize a retriever wrapper around the MongoDB Atlas vector store
const vectorStoreRetriever = vectorStore.asRetriever();

// Store chat history, starting with the system message that the assistant is a helpful insurance policies assistant
const history: BaseLanguageModelInput = [
  [
    "system",
    `You are a helpful insurance policies assistant. 
    Don't make up responses, only provide accurate information. Don't respond to meaningless questions.
    Use the context to provide accurate responses. Only provide information that is relevant to the user's question.`
  ],
];

const app = express();
app.use(cors());

const router = express.Router();
router.use(express.json());

router.post("/messages", async (req, res) => {
  let message = req.body.text;
  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  let prompt = `User question: ${message}.`;

  // If RAG is enabled, retrieve context from the MongoDB Atlas vector store
  const rag = req.body.rag;
  if (rag) {
    const context = await vectorStoreRetriever.invoke(message);

    if (context) {
      prompt += `

      Context:
      ${context?.map(doc => doc.pageContent).join("\n")}
    `;
    } else {
      console.error("Retrieval of context failed");
    }
  }

  try {
    const modelResponse = await model.invoke([...history, prompt]);
    const textResponse = modelResponse?.content;

    if (!textResponse) {
      return res.status(500).send({ error: 'Model invocation failed.' });
    }

    history.push([
      "human",
      message // Append only the user message to the history
    ]);

    history.push([
      "assistant",
      textResponse
    ]);

    return res.send({ text: textResponse });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Model invocation failed.' });
  }
});


app.use(router);

// start the Express server
app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}...`);
});
