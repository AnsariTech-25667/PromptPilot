// app/api/chat/ai/route.js
export const maxDuration = 60;

import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client (no DeepSeek, no custom baseURL)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Extract chatId and prompt from the request body
    const { chatId, prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
        { status: 400 }
      );
    }

    // Connect DB and fetch chat doc (must exist for your current UI)
    await connectDB();
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    // Push user message
    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    chat.messages.push(userMessage);

    // Call OpenAI (non-streaming; your UI already simulates streaming)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // choose a model you have access to
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text =
      completion?.choices?.[0]?.message?.content?.trim() || "…";

    // Shape the assistant message exactly like your UI expects
    const assistantMessage = {
      role: "assistant",
      content: text,
      timestamp: Date.now(),
    };

    chat.messages.push(assistantMessage);
    await chat.save();

    return NextResponse.json({ success: true, data: assistantMessage });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { success: false, message: "AI request failed" },
      { status: 500 }
    );
  }
}
