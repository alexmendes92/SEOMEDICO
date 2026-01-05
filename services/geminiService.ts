import { GoogleGenAI, Type } from "@google/genai";
import { ChartDataPoint, AuditReport } from '../types';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image (simulating Cloud Vision API)
 */
export const analyzeImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt || "Analyze this image in detail. List objects, detect text, and describe the scene." }
        ]
      }
    });
    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Vision Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

/**
 * Processes text for translation, NLP, or Q&A (Simulating Translation/NLP/Q&A APIs)
 */
export const processTextAnalysis = async (text: string, task: 'TRANSLATE' | 'SENTIMENT' | 'QA', targetLang?: string): Promise<string> => {
  let sysInstruction = "";
  let userPrompt = "";

  switch (task) {
    case 'TRANSLATE':
      sysInstruction = "You are a professional translator (Cloud Translation API).";
      userPrompt = `Translate the following text to ${targetLang || 'English'}:\n\n"${text}"`;
      break;
    case 'SENTIMENT':
      sysInstruction = "You are a Natural Language Processing engine (Cloud NLP API).";
      userPrompt = `Analyze the sentiment, extract entities, and syntax of the following text. Provide a structured report:\n\n"${text}"`;
      break;
    case 'QA':
      sysInstruction = "You are an intelligent business assistant (My Business Q&A API).";
      userPrompt = `Answer the following customer question or review professionally and helpfully:\n\n"${text}"`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: sysInstruction,
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Text Processing Error:", error);
    throw new Error("Failed to process text.");
  }
};

/**
 * Generates structured data for charts (Simulating Google Charts/Trends/Ads data)
 */
export const generateMarketData = async (query: string): Promise<{ summary: string, data: ChartDataPoint[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a JSON dataset representing market trends or performance metrics for: "${query}". 
      Also provide a brief summary string. 
      The JSON should be an array of objects with "name" (string) and "value" (number) keys.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Data Generation Error:", error);
    return { summary: "Could not generate data.", data: [] };
  }
};

/**
 * Simulates various specific APIs using Gemini's reasoning capabilities
 */
export const simulateApi = async (apiName: string, input: string): Promise<string> => {
  const prompt = `Act as the ${apiName}. Process the following input and return a realistic response typical of this API (e.g., JSON analysis, report, or status):
  
  Input: "${input}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "No response.";
  } catch (error) {
    console.error(`${apiName} Error:`, error);
    return `Error simulating ${apiName}.`;
  }
};

/**
 * Uses Google Search Grounding (Simulating Custom Search / Trends live data)
 */
export const performLiveSearch = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the following and provide a summary with sources: ${query}`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    // Extract grounding chunks if available for display
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let text = response.text || "";
    
    if (grounding) {
      const sources = grounding
        .map((chunk: any) => chunk.web?.title ? `- [${chunk.web.title}](${chunk.web.uri})` : null)
        .filter(Boolean)
        .join('\n');
      if (sources) text += `\n\n**Sources:**\n${sources}`;
    }
    
    return text;
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return "Search failed.";
  }
};

/**
 * Uses Google Maps Grounding (Simulating Places API)
 */
export const performMapsQuery = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find place information for: ${query}`,
      config: {
        tools: [{ googleMaps: {} }]
      }
    });
    return response.text || "No places found.";
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return "Maps query failed.";
  }
};

/**
 * Generates a comprehensive Site Audit Report using Search Grounding and JSON Schema
 */
export const generateSiteAudit = async (url: string): Promise<AuditReport> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a comprehensive technical and business audit of the website: ${url}.
      Use Google Search to find real details about this site's performance, reputation, technology stack, and content.
      
      Generate a report with EXACTLY 12 distinct resources/sections:
      1. SEO Analysis
      2. Performance Metrics (Core Web Vitals estimate)
      3. Mobile Responsiveness
      4. Accessibility (A11y)
      5. UI/UX Design Quality
      6. Security & Trust (SSL, Reputation)
      7. Content Quality & Relevance
      8. Technology Stack
      9. Social Media Presence
      10. Market Positioning / Competitors
      11. Monetization Strategy
      12. Final Verdict
      
      Return the data in strict JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING },
            overallScore: { type: Type.NUMBER, description: "0 to 100" },
            summary: { type: Type.STRING },
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  score: { type: Type.NUMBER, description: "0 to 100" },
                  status: { type: Type.STRING, enum: ["Excellent", "Good", "Fair", "Poor"] },
                  details: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Site Audit Error:", error);
    throw new Error("Failed to audit website.");
  }
};
