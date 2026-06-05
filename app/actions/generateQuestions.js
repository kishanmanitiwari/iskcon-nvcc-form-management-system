'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateQuestions(topic) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("Missing Google Generative AI API Key");
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `Generate 3 multiple-choice questions (MCQs) about "${topic}".
  
  Return the response ONLY as a JSON array of objects. Each object should have the following structure:
  {
    "type": "multiple_choice",
    "label": "The question text",
    "required": false,
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "The correct option text"
  }

  Do not wrap the JSON in markdown code blocks. Just return the raw JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up if there are markdown code blocks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
}




