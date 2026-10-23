import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";
import { OutputFixingParser } from "langchain/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

dotenv.config();

const llm = new ChatGroq({
  model: "openai/gpt-oss-20b",
  streaming: true,
  temperature: 0.7,
  maxTokens: 300,
});

// Fonction pour utiliser le StringOutputParser
async function useStringOutputParser() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Always answer in rymes to the user input."],
    ["human", "{input}"],
  ]);

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(llm).pipe(outputParser);

  const response = await chain.invoke({
    input: "What is the color of the sky?",
  });

  return response;
}

// Fonction pour utiliser le CommaSeparatedListOutputParser
async function useListOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
        Provide 5 objects with the following color: {color}.
    `);

  const outputParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(llm).pipe(outputParser);

  return await chain.invoke({
    color: "Red",
  });
}

// Structured Output Parser
async function useStructuredOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
        Give me the state of the light following input.
        Formating instructions: {format}
        input: {input}
        Never use backticks in your response \`\`\`.
    `);

  /*
    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "Light name",
        state: "Light state",
        color: "Light color",
        brightness: "Light brightness",
    });
    */
  // Version ZOD
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      name: z.string().describe("The name of the light."),
      state: z.string().describe("The state of the light."),
      color: z.string().describe("The color of the light."),
      brightness: z.string().describe("The brightness of the light."),
    }),
  );
  // Try fixing parsing problems
  const outputFixer = OutputFixingParser.fromLLM(llm, outputParser);

  const chain = prompt.pipe(llm).pipe(outputFixer);

  try {
    const response = await chain.invoke({
      input:
        "The light LightOne is turned on, the color is red and brightness is 50%.",
      format: outputParser.getFormatInstructions(),
    });
    return response;
  } catch (error) {
    console.error("Error during chain invocation:", error);
    throw error;
  }
}

// console.log(await useStringOutputParser());
// console.log(await useListOutputParser());
console.log(await useStructuredOutputParser());
