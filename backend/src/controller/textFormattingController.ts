import { Request, Response, NextFunction } from "express";
import { GoogleGenAI } from "@google/genai";
import { FORMATTING_PROMPT } from "../utils/prompts";
import {PortfolioSchema} from "../types/llmResponseFormat"
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const formatResumeData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    // console.log(req.body)
    const { rawText } = req.body;

    console.log("asfsa rawText", typeof(rawText))

    if (!rawText || typeof rawText !== "string") {
      res.status(400).json({ success: false, message: "rawText is required in the request body." });
      return;
    }

    console.log("Sending text to Gemini for formatting...");
    const geminiJsonSchema = zodToJsonSchema(PortfolioSchema as any);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Here is the raw resume text:\n\n${rawText}`,
      config: {
        systemInstruction: FORMATTING_PROMPT,
        responseMimeType: "application/json",
        responseSchema: geminiJsonSchema, 
      }
    });

    const rawContent = response.text;
    // console.log("hdhdhddhdh", rawContent)

    if (!rawContent) {
      throw new Error("Model returned empty data.");
    }
    const extractedData = JSON.parse(rawContent);

    res.status(200).json({
      success: true,
      message: "Data formatted successfully",
      data: extractedData
    });
  } catch (error) {
    console.error("LLM Formatting Error:", error);
    next(error);
  }
};