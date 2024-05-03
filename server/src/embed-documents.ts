import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";

import { connectToDatabase } from "./database.js";

// TODO: Implement embedding documents


process.exit(0);
