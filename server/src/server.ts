import express from "express";
import cors from "cors";
import { config } from "./config";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { connectToDatabase, collections } from "./database";

const router = express.Router();
router.use(express.json());

const model = new ChatVertexAI({
  model: "gemini-1.0-pro",
  maxOutputTokens: 2048, 
});

const history: BaseLanguageModelInput = [];
router.post("/messages", async (req, res) => {
  const message = req.body.text;

  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    history.push([
      "human",
      message
    ]);
  
    const modelResponse = await model.invoke(history, {
     temperature: 0.5,
     topP: 0.9,
     topK: 20,
    });

    const textResponse = modelResponse?.content;

    if (!textResponse) {
      history.pop(); // remove the last message if the model did not return a response
      return res.status(500).send({ error: 'Model invocation failed' });
    }

    history.push([
      "assistant",
      textResponse
    ])

    return res.send({ text: textResponse });
  } catch (e) {
    console.error(e);

    history.pop(); // remove the last message if the model did not return a response
    return res.status(500).send({ error: 'Model invocation failed' });
  }

});

connectToDatabase()
  .then(() => {
    const app = express();
    app.use(cors());

    app.use(router);

    // start the Express server
    app.listen(config.server.port, () => {
      console.log(`Server running at http://localhost:${config.server.port}...`);
    });
  })
  .catch((error) => console.error(error));


