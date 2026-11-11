import { tool } from "langchain";
import * as z from "zod";
import fs from "fs/promises";

/**
 * create/Update multiple files at once (create one if not existed)
 */

export const upsertFilesTool = tool(
  async function ({ files }) {
    await Promise.all(
      files.map(async (file) => {
        return fs.writeFile(file.path, file.content);
      }),
    );

    return "Files upserted successfully.";
  },
  {
    name: "upsertFiles",
    description:
      "Create or update multiple files at once. If a file does not exist, it will be created.",
    schema: z.object({
      files: z.array(
        z.object({
          path: z
            .string()
            .describe("Absolute path of the file to create or update."),
          content: z
            .string()
            .describe("The content of the file to create or update."),
        }),
      ),
    }),
  },
);
