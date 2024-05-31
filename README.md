# RAG Chat Assistant with MongoDB Atlas, Google Cloud and Langchain

This is a demo of a chatbot assistant using retrieval augmented generation (RAG).

## Technologies

The client is built with Angular and Angular Material. The server is built with Express.js and uses MongoDB Atlas for storing the vector data. The embeddings are generated with Google Cloud embeddings model. The conversation model uses Gemini 1.0 Pro model. The app also utilizes Langchain.

## Prerequisites

1. [Node.js](https://nodejs.org/) LTS.

1. Google Cloud account with Vertex AI APIs enabled.

## Setup

Follow the steps below to set up the chat assistant for local development.

### MongoDB Atlas Vector Store Setup

1. Create a [MongoDB Atlas](https://mongodb.com/try?utm_campaign=devrel&utm_source=cross-post&utm_medium=cta&utm_content=google-cloud-rag&utm_term=stanimira.vlaeva) account and deploy a free database. Complete the quickstart guide — create a database user and allowlist your IP address.

1. Clone the repository.

    ```
    git clone https://github.com/mongodb-developer/Google-Cloud-RAG-Langchain.git rag-chatbot
    cd rag-chatbot/server
    ```

1. Create a `.env` file in the `server` directory with the following content:

    ```
    ATLAS_URI=<your-atlas-connection-string>
    ```

1. Install the dependencies.

    **rag-chatbot/server/**
    ```
    npm install
    ```

1. Run the embedding script to vectorize the PDF data and store it in MongoDB Atlas.

    **rag-chatbot/server/**
    ```
    npm run embed-documents
    ```

1. Go back to MongoDB Atlas and verify that the data has been stored in the `chat-rag.context` collection.

1. Switch to the Atlas Search tab and click `Create Search Index`. Select `JSON Editor` in the **Atlas Vector Search** section.

1. From the left sidebar, select the `chat-rag` database and the `context` collection.

1. Add the following JSON schema:

    ```
    {
        "fields": [
            {
            "numDimensions": 768,
            "path": "embedding",
            "similarity": "euclidean",
            "type": "vector"
            }
        ]
    }
    ```

1. Wait for the status to change to `Active`.

### Server setup

1. Start the server.

    **rag-chatbot/server/**
    ```
    npm start
    ```

### Client setup

1. Open a new terminal emulator and navigate to the `client` directory.

    ```
    cd ../client
    ```

1. Install the dependencies and start the client.

    **rag-chatbot/client/**
    ```
    npm install && npm start
    ```

1. Open a browser and navigate to `http://localhost:4200`.

1. Try asking the chatbot questions like "What is the coverage of my insurance policy?" or "What are the specifics of my car insurance?". Use the `RAG` toggle to switch between retrieval augmented generation and retrieval only.


## Contributors ✨

This demo is inspired by the [Chat Application with RAG Feature Toggle and Backend Server](https://github.com/voxic/GCP_RAG_Chatbot/tree/main).

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center">
        <a href="https://twitter.com/StanimiraVlaeva">
            <img src="https://pbs.twimg.com/profile_images/1645826266770055168/SS9kFxoJ_400x400.jpg" width="100px;" alt=""/><br />
            <sub><b>Stanimira Vlaeva</b></sub>
        </a><br />
    </td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->



## Disclaimer

Use at your own risk; not a supported MongoDB product
