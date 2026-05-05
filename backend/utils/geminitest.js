import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const testGemini = async () => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent("Say hello");

    const text = result.response.text();

    console.log("✅ Gemini response:", text);

  } catch (err) {
    console.error("❌ Gemini error:", err);
  }
};

testGemini();