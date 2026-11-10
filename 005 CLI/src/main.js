import { getSettingsFile, saveApiKey, getApiKey } from "./utils/file.utils.js";
import rl from "./utils/readline.js";

async function main() {
  const settings = await getSettingsFile();

  if (!settings.apiKey) {
    console.log("API key not found in settings. Please set your API key.");

    const apiKey = await rl.question("Enter your API key: ");
    await saveApiKey(apiKey);
  }

  const response = await getApiKey();

  if (response.error) {
    console.error("Invalid or expired API key. Please set a valid API key.");
    const apiKey = await rl.question("Enter your API key: ");
    await saveApiKey(apiKey);
    return main();
  }

  const apiKey = response.apiKey;

  console.log(`Your API key is: ${apiKey}`);

  rl.close();
}

export default main;
