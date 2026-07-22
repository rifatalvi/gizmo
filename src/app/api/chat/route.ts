import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// We check if API key exists. If not, the component will handle it, but we shouldn't crash here.
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  if (!ai) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured in .env" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();
    
    // For a simple implementation, we just take the last user message.
    // To support full history, we would map the messages to the expected format.
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: lastUserMessage.content,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response from Gemini" },
      { status: 500 }
    );
  }
}
