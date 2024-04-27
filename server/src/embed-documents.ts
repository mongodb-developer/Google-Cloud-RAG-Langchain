import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { connectToDatabase } from "./database";

// Load all PDFs within the specified directory
const directoryLoader = new DirectoryLoader(
  "pdf_documents/",
  {
    ".pdf": (path: string) => new PDFLoader(path),
  }
);

const docs = await directoryLoader.load();

console.log(`Loaded ${docs.length} PDFs from the specified local directory.`);

// Split the PDF documents into chunks using recursive character splitter
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const splitDocs = await textSplitter.splitDocuments(docs);
console.log(`Split into ${splitDocs.length} text chunks using recursive character splitting.`);

// Connect to the MongoDB database
const collections = await connectToDatabase();

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

// Insert the text chunks to the MongoDB Atlas vector store
const result = await vectorStore.addDocuments(splitDocs);

console.log(`Imported ${result.length} documents into the MongoDB Atlas vector store.`);

process.exit(0);
