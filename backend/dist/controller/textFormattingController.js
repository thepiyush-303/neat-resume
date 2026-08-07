"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResumeData = void 0;
const genai_1 = require("@google/genai");
const prompts_1 = require("../utils/prompts");
const llmResponseFormat_1 = require("../types/llmResponseFormat");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const formatResumeData = async (req, res, next) => {
    try {
        // console.log(req.body)
        const { rawText } = req.body;
        console.log("asfsa rawText", typeof (rawText));
        if (!rawText || typeof rawText !== "string") {
            res.status(400).json({ success: false, message: "rawText is required in the request body." });
            return;
        }
        console.log("Sending text to Gemini for formatting...");
        const geminiJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(llmResponseFormat_1.PortfolioSchema);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here is the raw resume text:\n\n${rawText}`,
            config: {
                systemInstruction: prompts_1.FORMATTING_PROMPT,
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
        console.log(extractedData);
        res.status(200).json({
            success: true,
            message: "Data formatted successfully",
            data: extractedData
        });
    }
    catch (error) {
        console.error("LLM Formatting Error:", error);
        next(error);
    }
};
exports.formatResumeData = formatResumeData;
