import { GoogleGenAI } from "@google/genai";

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

let geminiPausedUntil = 0; // after a quota error, skip Gemini for a while

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

async function callGemini({ system, user, maxTokens }) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await withTimeout(
        gemini.models.generateContent({
          model: GEMINI_MODEL,
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
      if (err.status !== 503 || attempt === 1) throw err; // retry once if "busy"
      await sleep(1000);
    }
  }
}

async function callGroq({ system, user, maxTokens }) {
  const res = await withTimeout(
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: maxTokens + 1000,
      }),
    }),
    15000
  );

  if (!res.ok) {
    const err = new Error(`Groq error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function askAI({ system, user, maxTokens = 800 }) {
  const providers = [];
  if (gemini && Date.now() > geminiPausedUntil) providers.push(["gemini", callGemini]);
  if (process.env.GROQ_API_KEY) providers.push(["groq", callGroq]);

  if (providers.length === 0) {
    throw Object.assign(new Error("No AI provider available"), { status: 503 });
  }

  let lastErr;
  for (const [name, fn] of providers) {
    try {
      return await fn({ system, user, maxTokens });
    } catch (err) {
      lastErr = err;
      console.error(`[ai] ${name} failed:`, err.status || "", String(err.message).slice(0, 200));
      if (name === "gemini" && err.status === 429) {
        geminiPausedUntil = Date.now() + 10 * 60 * 1000;
      }
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