import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";
dotenv.config();

export const model = google("gemini-2.0-flash");

export const answerQuestion = async (prompt: string) => {
  const { text } = await generateText({
    model,
    prompt
  });

  return text;
};

const answer = await answerQuestion("What is the capital of France?");
console.log(answer);
