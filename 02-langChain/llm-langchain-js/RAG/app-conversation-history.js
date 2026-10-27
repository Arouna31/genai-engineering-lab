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
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

dotenv.config();

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Answer the user's question based on the following context: {context}.",
  ],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
]);

const chain = await createStuffDocumentsChain({
  prompt,
  llm,
});

const pdfLoader = new PDFLoader("test.pdf");
const pdfDocs = await pdfLoader.load();

const loader = new CheerioWebBaseLoader("https://www.faicalkinda.dev/");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 50,
});

const splittedDocs = await splitter.splitDocuments(docs);

splittedDocs.push(...pdfDocs);

const nomicEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});

const vectorStore = await MemoryVectorStore.fromDocuments(
  splittedDocs,
  nomicEmbeddings,
);

const retriever = vectorStore.asRetriever({
  k: 2,
});

const rephrasePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  [
    "user",
    `Given the conversation history and the latest user question,
    formulate a standalone search query that can be understood
    without the conversation history.

    Do not answer the question.
    Only reformulate it if necessary.
    Otherwise, return the original question.`,
  ],
]);

const historyAwareRetriever = await createHistoryAwareRetriever({
  retriever,
  chatHistorySize: 2,
  llm,
  rephrasePrompt,
});

const conversationChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever: historyAwareRetriever,
});

const chatHistory = [
  new HumanMessage("What is the real expertise domain of Faical KINDA"),
  new AIMessage("I'ts a Angular prefessionnal architect"),
  new HumanMessage("He is own a github repository ?"),
  new AIMessage("yes of course"),
];

const response = await conversationChain.invoke({
  input: "What we was talking about ?",
  chat_history: chatHistory.splice(4),
});

console.log(response);
