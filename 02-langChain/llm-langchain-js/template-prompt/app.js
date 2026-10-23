import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";

dotenv.config();

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  streaming: true,
  temperature: 0.7,
  maxTokens: 300,
});

// const prompt = ChatPromptTemplate.fromTemplate(
//   "Réponds toujours en utilisasnt l'argo ivoirien , le nouchi, au message de l'utilisateur suivant : {input} ",
// );

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Réponds toujours en utilisasnt l'argo ivoirien , le nouchi, au message de l'utilisateur.",
  ],
  ["human", "{input}"],
]);

// Chain creation
const chain = prompt.pipe(llm);

// Invoke chain
const response = await chain.invoke({
  input: "Est ce que tu connais mousso là même ?",
});

process.stdout.write(response.content);
