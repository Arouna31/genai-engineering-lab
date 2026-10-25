import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { Document } from "@langchain/core/documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";

dotenv.config();

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
});

const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question.
    Context: {context}
    Question: {input}
`);

const chain = await createStuffDocumentsChain({
  prompt,
  llm,
});

// On charge le contenu de la page web
const loader = new CheerioWebBaseLoader("https://www.faicalkinda.dev/");
const docs = await loader.load();
// console.log(docs);

// On découpe le contenu de la page web en morceaux de 250 caractères
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 250,
  chunkOverlap: 50,
});

// On découpe les documents en morceaux
const splittedDocs = await splitter.splitDocuments(docs);
// console.log(splittedDocs);

// On met en place les embeddings
const nomicEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});

// On crée le vector store
const vectorStore = await MemoryVectorStore.fromDocuments(
  splittedDocs.slice(0, 3),
  nomicEmbeddings,
);

const retriever = vectorStore.asRetriever({
  k: 2,
});

const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

const response = await retrievalChain.invoke({
  input: "What is the expertise of Faical KINDA ?",
});

console.log(response);
