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

const resume_anthony = new Document({
  pageContent:
    "Anthony Cardinale is a web developper. His skills are html, css, javascript, php. He is also a tech trainer.",
});

const chain = await createStuffDocumentsChain({
  prompt,
  llm,
  documents: [resume_anthony],
});

const response = await chain.invoke({
  input: "What is Anthony's job?",
  context: [resume_anthony],
});

console.log(response);
