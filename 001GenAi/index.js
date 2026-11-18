import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import rl from "readline/promises";
import { tool, createAgent, context } from "langchain";
import * as z from "zod";
import { StateGraph, START, END } from "@langchain/langgraph";

dotenv.config();

const events = [];

const createEventTool = tool(
  async function ({ date, title, description }) {
    console.log("Creating event:", { date, title, description });
    events.push({ date, title, description });
    return "Event created successfully.";
  },
  {
    name: "createEvent",
    description: "Creates an event with a date, title, and description.",
    schema: z.object({
      date: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  },
);

const getEventsTool = tool(
  async function () {
    console.log("Getting events", events);
    return events;
  },
  {
    name: "getEvents",
    description: "Returns a list of all events.",
    schema: z.object({}),
  },
);

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

// Graph  LLM Node

// create node
async function LLMNode(state) {
  console.log("LLMNode state:", state);

  return {
    messages: [
      ...state.messages,
      {
        role: "assistant",
        content: "Hello, World!",
      },
    ],
  };
}

//Define state using zod schema
const graph = new StateGraph(
  z.object({
    messages: z.array(z.any()),
  }),
)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();

const graphResult = await graph.invoke({
  messages: [
    {
      role: "user",
      content: "Hello, World!",
    },
  ],
});

console.log("Graph Result : ", graphResult);

// chat app
// const agent = createAgent({
//   model,
//   tools: [createEventTool, getEventsTool],
// });

// while (true) {
//   const userInput = await readline.question("Enter your prompt: ");

//   const stream = await agent.stream(
//     {
//       messages: [
//         {
//           role: "user",
//           content: userInput,
//         },
//       ],
//     },
//     { streamMode: "messages" },
//   );

//   for await (const [chunk] of stream) {
//     process.stdout.write(chunk.content);
//   }

//   process.stdout.write("\n\n");
// }

// const messages = [];

// while (true) {
//   const userInput = await readline.question("Enter your prompt: ");

//   messages.push({
//     role: "user",
//     content: userInput,
//   });

//   const stream = await model.stream(messages);

//   let aiMessage = "";

//   for await (const chunk of stream) {
//     aiMessage += chunk.content;
//     process.stdout.write(chunk.content);
//   }

//   process.stdout.write("\n\n");
// }
