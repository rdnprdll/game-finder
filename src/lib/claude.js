import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function askClaude({ system, user, maxTokens = 800 }) {
  let lastErr;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: MODEL,
        contents: user,
        config: {
          systemInstruction: system,
          responseMimeType: "application/json",
          maxOutputTokens: maxTokens + 1500,
        },
      });
      return res.text;
    } catch (err) {
      lastErr = err;
      if (err.status !== 503) throw err; // only retry "busy" errors
      await sleep(2000 * (attempt + 1)); // wait 2s, then 4s, then 6s
    }
  }

  throw lastErr;
}

// Grab just the {...} part in case the AI adds extra text
export function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in reply");
  return JSON.parse(text.slice(start, end + 1));
}