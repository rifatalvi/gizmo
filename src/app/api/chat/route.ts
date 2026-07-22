import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured in .env" },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { messages } = await req.json();
    
    // For a simple implementation, we just take the last user message.
    // To support full history, we would map the messages to the expected format.
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(lastUserMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat API Error details:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate response from Gemini", 
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
}
