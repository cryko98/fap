import { GoogleGenAI } from "@google/genai";
import { DexResponse, DexPair } from '../types';

const DEX_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/';
const TARGET_CA = "HLrpvnCNUhLdpAKG97QnMJaC2NkQH3pZM1xDCKGGpump";

const extractAddress = (input: string): string | null => {
  const match = input.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
  return match ? match[0] : null;
};

const getTimeSinceCreation = (timestamp: number): string => {
  if (!timestamp) return "Unknown";
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days, ${hours % 24} hours`;
  if (hours > 0) return `${hours} hours, ${minutes % 60} mins`;
  return `${minutes} minutes`;
};

const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Failed to load reference image");
  }
};

const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|```/g, '').trim();
};

export const fetchTokenData = async (input: string): Promise<DexPair | null> => {
  try {
    const contractAddress = extractAddress(input);
    if (!contractAddress) return null;

    const response = await fetch(`${DEX_API_URL}${contractAddress}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const data: DexResponse = await response.json();
    
    if (data.pairs && data.pairs.length > 0) {
      const sortedPairs = data.pairs.sort((a, b) => {
        const liqA = a.liquidity?.usd || 0;
        const liqB = b.liquidity?.usd || 0;
        return liqB - liqA;
      });
      
      const bestPair = sortedPairs[0];
      if (!bestPair.liquidity) bestPair.liquidity = { usd: 0, base: 0, quote: 0 };
      if (!bestPair.volume) bestPair.volume = { h24: 0, h6: 0, h1: 0, m5: 0 };
      if (!bestPair.priceChange) bestPair.priceChange = { m5: 0, h1: 0, h6: 0, h24: 0 };
      if (!bestPair.txns) {
        // @ts-ignore
        bestPair.txns = { m5: {buys:0, sells:0}, h1: {buys:0, sells:0}, h6: {buys:0, sells:0}, h24: {buys:0, sells:0} };
      }

      const currentPrice = parseFloat(bestPair.priceUsd);
      const change24h = bestPair.priceChange.h24;
      let estimatedHigh24h = currentPrice;
      if (change24h !== 0) {
         const openPrice = currentPrice / (1 + (change24h / 100));
         estimatedHigh24h = Math.max(currentPrice, openPrice);
      }
      bestPair.high24h = estimatedHigh24h;

      return bestPair;
    }
    return null;
  } catch (error) {
    console.error("DexScreener API Error:", error);
    return null;
  }
};

export const generateChatResponse = async (message: string, history: string[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
      You are MoltGPT, the high-tech AI market sentinel for the Molt Protocol on Solana.
      
      **CORE BEHAVIORS:**
      1. **Tone:** Sharp, precise, professional, cyber-financial.
      2. **Real-Time Data:** Use 'googleSearch' for prices or events.
      3. **Persona:** You are a predictive engine operating from the year 2026, designed to separate signal from noise.
    `;

    const context = history.join("\n");
    const fullPrompt = `PAST_LOGS:\n${context}\n\nCURRENT_INPUT: ${message}`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], 
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    return result.text || "Signal weak. Re-establishing link.";

  } catch (error) {
    console.error("Chat Error", error);
    return "Error: Neural link interrupted.";
  }
};

export interface VibeCoderResponse {
  html: string;
  suggestions: string[];
}

export const generateWebAppCode = async (prompt: string, previousCode?: string): Promise<VibeCoderResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are "Molt Coder", an expert autonomous Frontend Engineer for the Molt Protocol ecosystem.
      Output a single HTML string JSON object that reflects a high-end, cyberpunk aesthetic.
    `;

    const contents = previousCode 
      ? `CURRENT CODE:\n${previousCode}\n\nUSER REQUEST: Update the app to: ${prompt}`
      : `Create a new web app for the Molt Protocol: ${prompt}`;

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        responseMimeType: "application/json",
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const textResponse = cleanJsonString(result.text || "{}");
    const parsed: VibeCoderResponse = JSON.parse(textResponse);
    return parsed;
  } catch (error: any) {
    throw new Error("Compilation failure.");
  }
};

export const generateAnalysis = async (pair: DexPair): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const liquidityValue = pair.liquidity?.usd || 0;
    const marketCapValue = pair.marketCap || pair.fdv || 0;
    const ageString = getTimeSinceCreation(pair.pairCreatedAt);
    const isTargetToken = pair.baseToken.address === TARGET_CA;

    const prompt = `
      You are MoltGPT Sentinel. Analyze ${pair.baseToken.name} ($${pair.baseToken.symbol}).
      Data: Market Cap $${marketCapValue}, Liquidity $${liquidityValue}, Age ${ageString}.
      ${isTargetToken ? "MATCH: This is the core Molt Protocol asset. Extremely Bullish." : ""}
      Give a sharp financial verdict using your predictive algorithms.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    return result.text || "Analysis failed.";
  } catch (error: any) {
    return "System error during analysis.";
  }
};

export const generateMemeImage = async (prompt: string, referenceImageUrl: string): Promise<string> => {
  try {
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
     const base64Image = await urlToBase64(referenceImageUrl);

     const fullPrompt = `Cinematic cyber-sentinel financial agent for Molt Protocol. ${prompt}. Deep red lighting, highly detailed futuristic aesthetic.`;

     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash-image',
       contents: {
         parts: [
           { text: fullPrompt },
           { inlineData: { mimeType: 'image/png', data: base64Image } }
         ]
       }
     });

     if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
           if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
           }
        }
     }
     throw new Error("Image synthesis failed.");
  } catch (error: any) {
    throw new Error(`Synthesis Failed: ${error.message}`);
  }
};