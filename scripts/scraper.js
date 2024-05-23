const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const OpenAI = require("openai");

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const modelType = "gpt4"; // Set this to 'gemini' or 'gpt4' to switch models

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction:
    "You are the COO of Tramitit.com, a website that collects the governmental procedures and explains through in a given format.",
});

const generationConfig = {
  temperature: 0.3,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

async function retryOperation(operation, maxRetries = 5, delay = 1000) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      if (error.status === 429) {
        retries++;
        console.log(`Rate limit hit, retrying in ${delay * retries}ms...`);
        await new Promise((res) => setTimeout(res, delay * retries));
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Operation failed after ${maxRetries} retries`);
}

// Gemini Functions
async function generateProcedureGemini(service, url) {
  console.log(`Generating procedure for Gemini with URL: ${url}`);
  const chatSession = geminiModel.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Given the following page, can you detail step by step how to do ${service}? Include all external links possible. Make sure to only cover the information written there.\n\n${url}\n\nUse the following markdown format:\n\n\n---\ntitle: "Service"\n# meta title\nmeta_title: ""\n# meta description\ndescription: "This is meta description"\n# save as draft\ndraft: false\n---\n\n{{< toc >}}\n\n## Description\n#### What is it?\n{description of the service}\n#### Who needs it?\n{ideal customer profile}\n\n## Procedure\n{numbered list with step by step procedure on how to achieve the service}\n\n## Required Documents\n{list of required documents and how to obtain them}\n\n## Providers that can do it for you\n\n| Provider        |     Website     |     Timelines    |       Cost      |\n| --------------- | --------------- |  :-------------: | :-------------: |\n| Provider 1      |  https//:       |      x days      |        $X       |\n\n## Additional details\n{other details extracted from the source that might be relevant for the user}`,
          },
        ],
      },
    ],
  });

  const result = await retryOperation(() =>
    chatSession.sendMessage("Insert the prompt here"),
  );
  console.log("Procedure generated for Gemini");
  return result.response.text();
}

// GPT-4 Functions
async function generateProcedureGPT4(service, url) {
  console.log(`Generating procedure for GPT-4 with URL: ${url}`);
  const prompt = `Given the following page, can you detail step by step how to do ${service}? Include all external links possible. Make sure to only cover the information written there.\n\n${url}\n\nUse the following markdown format:\n\n\n---\ntitle: "Service"\n# meta title\nmeta_title: ""\n# meta description\ndescription: "This is meta description"\n# save as draft\ndraft: false\n---\n\n{{< toc >}}\n\n## Description\n#### What is it?\n{description of the service}\n#### Who needs it?\n{ideal customer profile}\n\n## Procedure\n{numbered list with step by step procedure on how to achieve the service}\n\n## Required Documents\n{list of required documents and how to obtain them}\n\n## Providers that can do it for you\n\n| Provider        |     Website     |     Timelines    |       Cost      |\n| --------------- | --------------- |  :-------------: | :-------------: |\n| Provider 1      |  https//:       |      x days      |        $X       |\n\n## Additional details\n{other details extracted from the source that might be relevant for the user}`;

  const response = await retryOperation(() =>
    openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  );

  console.log("Procedure generated for GPT-4");
  return response.choices[0].message.content;
}

// Wrapper Functions
async function generateProcedure(service, url) {
  if (modelType === "gemini") {
    return generateProcedureGemini(service, url);
  } else if (modelType === "gpt4") {
    return generateProcedureGPT4(service, url);
  } else {
    throw new Error("Unsupported model type");
  }
}

async function run() {
  console.log("Starting the script");

  const services = [];

  fs.createReadStream("scripts/services.csv")
    .pipe(csv())
    .on("data", (row) => {
      services.push(row);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");
      for (const { service, url } of services) {
        console.log(`Processing service '${service}' with URL ${url}`);
        const trimmedUrl = url.trim();
        if (trimmedUrl) {
          const fileName = `${service.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
          const filePath = `scripts/${fileName}`;
          if (!fs.existsSync(filePath)) {
            const procedureMarkdown = await generateProcedure(
              service,
              trimmedUrl,
            );
            console.log(
              `Writing procedure for service: ${service} and URL: ${trimmedUrl}`,
            );
            fs.writeFileSync(filePath, procedureMarkdown);
          } else {
            console.log(
              `File for service '${service}' already exists, skipping creation.`,
            );
          }
        }
      }
      console.log("Script finished");
    });
}

run().catch(console.error);
