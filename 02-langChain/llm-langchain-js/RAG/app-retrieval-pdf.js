import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { Document } from "@langchain/core/documents";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

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

// Exemple charger un document PDF
const pdfLoader = new PDFLoader("test.pdf");

const docs = await pdfLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 50,
});

const splittedDocs = await splitter.splitDocuments(docs);

// Add the pdfDocs to the splittedDocs
splittedDocs.push(...docs);

const nomicEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});

const vectorStore = await MemoryVectorStore.fromDocuments(
  //   splittedDocs.slice(0, 3),
  splittedDocs,
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
  input: "What is the amount of this receipt ?",
});

console.log(response);
