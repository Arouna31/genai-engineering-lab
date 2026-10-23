import { ChatGroq } from "@langchain/groq";
import * as dotenv from "dotenv";

dotenv.config();

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  streaming: true,
  temperature: 0.7,
  maxTokens: 300,
});

const response = await llm.stream("Hello !");

for await (const message of response) {
  if (typeof message.content === "string") {
    process.stdout.write(message.content);
  }
}
