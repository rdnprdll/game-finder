import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(Object.assign(new Error("AI timeout"), { status: 504 })),
        ms
      )
    ),
  ]);
}

export async function askClaude({ system, user, maxTokens = 800 }) {
  let lastErr;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await withTimeout(
        ai.models.generateContent({
          model: MODEL,
          contents: user,
          config: {
            systemInstruction: system,
            responseMimeType: "application/json",
            maxOutputTokens: maxTokens + 1500,
          },
        }),
        15000
      );
      return res.text;
    } catch (err) {
      lastErr = err;
      if (err.status !== 503) throw err; // retry only when Google says "busy"
      await sleep(1000);
    }
  }

  throw lastErr;
}

export function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in reply");
  return JSON.parse(text.slice(start, end + 1));
}