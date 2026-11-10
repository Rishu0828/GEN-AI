import { getSettingsFile, saveApiKey, getApiKey } from "./utils/file.utils.js";
import rl from "./utils/readline.js";

async function main() {
  const settings = await getSettingsFile();

  if (!settings.apiKey) {
    console.log("API key not found in settings. Please set your API key.");

    const apiKey = await rl.question("Enter your API key: ");
    await saveApiKey(apiKey);
  }

  const apiKey = await getApiKey();

  console.log(`Your API key is: ${apiKey}`);

  rl.close();
}

export default main;
