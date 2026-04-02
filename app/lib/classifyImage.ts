import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function classifyImage(base64Image: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in .env");
  }

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: 'You are a fashion expert. Analyze the garment image and return ONLY valid JSON with these fields: description, garmentType, style, material, colorPalette, pattern, season, occasion, consumerProfile, trendNotes, continent, country, city. If unsure, use "Unknown".',
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Analyze this fashion image.",
          },
          {
            type: "input_image",
            image_url: base64Image,
            detail: "auto",
          },
        ],
      },
    ],
  });

  const text = response.output_text?.trim() || "{}";

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Model did not return valid JSON: ${text}`);
  }
}