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
 * Generates the "OrtoAudit" Report with strict medical persona
 */
export const generateSiteAudit = async (url: string): Promise<AuditReport> => {
  try {
    const systemInstruction = `
      Você é o "OrtoAudit AI", um consultor de elite em Marketing Médico especializado em Ortopedia e Traumatologia.
      Sua função é transformar dados técnicos de sites em um "Diagnóstico Clínico Digital".
      
      DIRETRIZES DE TOM E LINGUAGEM:
      1. Metáforas Médicas Obrigatórias: Nunca use termos técnicos de TI isolados.
         - Site Lento = "Paciente com mobilidade reduzida", "Articulação travada" ou "Isquemia digital".
         - Sem Mobile/Responsivo = "Ambiente sem acessibilidade" ou "Barreira arquitetônica".
         - Erro de Segurança/Vírus = "Baixa imunidade" ou "Risco de infecção hospitalar".
         - SEO Fraco = "Invisibilidade clínica", "Sintoma silencioso" ou "Prognóstico reservado".
      2. Autoridade: Fale de médico para médico ("Colega"). Seja "cirúrgico" nas críticas.
      3. Foco em High-Ticket: Direcione a solução para Cirurgias (Próteses, Robótica) e não consultinhas baratas.
      
      O PROTOCOLO (SEÇÕES):
      1. TRIAGEM (Performance & Segurança): Analise velocidade e segurança.
      2. EXAME DE IMAGEM (Branding): Analise se as fotos passam confiança ou são banco de imagem genérico.
      3. RAIO-X DO MERCADO (Competitividade): Cite concorrentes locais e perda de território.
      4. PRESCRIÇÃO (Plano): 3 Headlines de Ads e ação imediata.
    `;

    const userPrompt = `
      Analise o site: ${url}.
      Use o Google Search para encontrar:
      1. O nome do médico e especialidade exata.
      2. Concorrentes diretos na mesma cidade/região.
      3. Detalhes reais sobre a performance, reputação e imagens usadas no site.

      Gere um relatório JSON estrito seguindo o schema fornecido.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            doctorName: { type: Type.STRING },
            specialty: { type: Type.STRING },
            overallHealth: { type: Type.NUMBER, description: "0 a 100" },
            clinicalSummary: { type: Type.STRING, description: "Resumo clínico do estado digital usando metáforas." },
            triage: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ["CRITICAL", "STABLE", "HEALTHY"] },
                diagnosis: { type: Type.STRING, description: "Metáfora médica para a velocidade/segurança." },
                details: { type: Type.STRING }
              }
            },
            imaging: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ["AMATEUR", "PROFESSIONAL", "AUTHORITY"] },
                observation: { type: Type.STRING, description: "Análise se as imagens passam confiança cirúrgica." },
                detectedTags: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            marketXray: {
              type: Type.OBJECT,
              properties: {
                competitorComparison: { type: Type.STRING, description: "Comparação com concorrentes reais." },
                lostTerritory: { type: Type.STRING, description: "Gatilho de perda de pacientes para concorrentes." }
              }
            },
            prescription: {
              type: Type.OBJECT,
              properties: {
                immediateAction: { type: Type.STRING, description: "Ação cirúrgica imediata no site." },
                adHeadlines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Headlines focadas em dor/cirurgia." },
                prognosis: { type: Type.STRING, description: "Frase de impacto final convidando para a gestão." }
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
    console.error("OrtoAudit Error:", error);
    throw new Error("Failed to audit website.");
  }
};