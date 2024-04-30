import express from "express";
import cors from "cors";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { pull } from "langchain/hub";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

import { config } from "./config";
import { connectToDatabase, collections } from "./database";
import { BaseMessage } from "@langchain/core/messages";

await connectToDatabase();

const model = new ChatVertexAI({
  model: "gemini-1.0-pro",
  maxOutputTokens: 2048,
  temperature: 0.5,
  topP: 0.9,
  topK: 20,
});

// Instantiates a new MongoDBAtlasVectorSearch object with the specified configuration
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

const rephrasePrompt = await pull("langchain-ai/chat-langchain-rephrase");
const retriever = await createHistoryAwareRetriever({
  llm: model,
  retriever: vectorStoreRetriever,
  rephrasePrompt: rephrasePrompt as any,
});

const app = express();
app.use(cors());

const router = express.Router();
router.use(express.json());

const history: BaseLanguageModelInput = [
  ["system", "You are a helpful insurance policies assistant. Don't make up responses, only provide accurate information. Don't respond to meaninless questions."],
];

router.post("/messages", async (req, res) => {
  let message = req.body.text;
  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  message = `User question: ${message}.`;

  const rag = req.body.rag;
  if (rag) {
    const context = await retriever.invoke({
      input: message,
      chat_history: history as BaseMessage[],
    });
    if (!context) {
      console.error("Retrieval of context failed");
    }

    message += `

      Context:
      ${context?.map(doc => doc.pageContent).join("\n")}
    `;
  }

  try {
    history.push([
      "human",
      message
    ]);

    const modelResponse = await model.invoke(history);
    const textResponse = modelResponse?.content;

    if (!textResponse) {
      history.pop(); // remove the last message if the model did not return a response
      return res.status(500).send({ error: 'Model invocation failed' });
    }

    history.push([
      "assistant",
      textResponse
    ]);

    return res.send({ text: textResponse });
  } catch (e) {
    console.error(e);

    history.pop(); // remove the last message if the model did not return a response
    return res.status(500).send({ error: 'Model invocation failed' });
  }
});


app.use(router);

// start the Express server
app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}...`);
});
