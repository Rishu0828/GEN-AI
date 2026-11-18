import { ChatCohere, CohereEmbeddings } from "@langchain/cohere";
import "dotenv/config";

const userInput = "tell me about Array's internship";

// _______________________Initialize Embadings Model_______________

const embaddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY,
  model: "embed-v5.0-fast",
});

const vector = await embaddings.embedQuery(userInput);

// __________________Initialize Pinecone client ______________________
const pc = new Phinecode({ apiKey: process.env.PHINECODE_API_KEY });

const model = new ChatCohere({
  model: "command-a-03-2025",
  apikey: process.env.COHERE_API_KEY,
});

const response = await model.invoke(userInput);
