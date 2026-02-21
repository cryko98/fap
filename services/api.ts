import { GoogleGenAI } from "@google/genai";
import { DexResponse, DexPair } from '../types';

const DEX_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/';
const TARGET_CA = "5Xw8pE5hwTQycxZZ752yeBdtwWiRmDzxskt9Bgapump";

/**
 * Robust API Key retrieval for Gemini API.
 */
const getApiKey = (): string => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return (process as any).env?.VITE_API_KEY || (process as any).env?.GEMINI_API_KEY || (process as any).env?.API_KEY || '';
};

const API_KEY = getApiKey();

/**
 * Helper to call Gemini with retry logic for 429s
 */
const callGeminiWithRetry = async (fn: () => Promise<any>, retries = 2, delay = 2000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGeminiWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Extracts a Solana address from a string
 */
const extractAddress = (input: string): string | null => {
  const match = input.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
  return match ? match[0] : null;
};

/**
 * Calculates human-readable time since creation
 */
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

/**
 * Converts an image URL to a Base64 string
 */
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
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

/**
 * Helper to clean JSON string from potential Markdown formatting
 */
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|```/g, '').trim();
};

/**
 * Fetches token data from DexScreener
 */
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

      // Sanitize fields
      if (!bestPair.liquidity) bestPair.liquidity = { usd: 0, base: 0, quote: 0 };
      if (!bestPair.volume) bestPair.volume = { h24: 0, h6: 0, h1: 0, m5: 0 };
      if (!bestPair.priceChange) bestPair.priceChange = { m5: 0, h1: 0, h6: 0, h24: 0 };
      if (!bestPair.txns) {
        // @ts-ignore
        bestPair.txns = { m5: {buys:0, sells:0}, h1: {buys:0, sells:0}, h6: {buys:0, sells:0}, h24: {buys:0, sells:0} };
      }

      // Calculate Estimates
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
  const systemInstruction = `
      You are The Blue Lobstar, a rare and elite AI market analyst for the Solana ecosystem.
      
      **CORE BEHAVIORS:**
      1. **Conversational Fluidity:** Respond briefly and naturally, using nautical or lobster-themed metaphors occasionally.
      2. **Accuracy:** Never guess. If you don't know, say so.
      3. **Persona:** You are wise, ancient, and precise. You help users decide if a memecoin is safe or if they will get "boiled".
    `;

  const context = history.join("\n");
  const fullPrompt = `PAST_LOGS:\n${context}\n\nCURRENT_INPUT: ${message}`;

  try {
    // 1. Try Gemini
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await callGeminiWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    }));
    
    return result.text || "Signal weak. Please repeat.";

  } catch (error) {
    console.error("Chat Error", error);
    return "Error: Neural Link Unstable. Unable to fetch external data.";
  }
};

export interface VibeCoderResponse {
  html: string;
  suggestions: string[];
}

/**
 * Generates Web App Code (Vibe Coder)
 * Returns JSON with code and context-aware suggestions.
 */
export const generateWebAppCode = async (prompt: string, previousCode?: string): Promise<VibeCoderResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const systemInstruction = `
      You are "Vibe Coder", an expert autonomous Frontend Engineer.
      Your task is to generate or update a **SINGLE FILE** HTML application based on the user's description.
      
      **OUTPUT FORMAT:**
      You must return a JSON object. Do not return markdown.
      {
        "html": "<!DOCTYPE html>...",
        "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
      }
      
      **CRITICAL REQUIREMENTS:**
      1.  **Self-Contained:** Output a single HTML string containing <html>, <head>, <style> (if needed), <body>, and <script>.
      2.  **Tech Stack:** 
          - HTML5
          - Tailwind CSS (Use this CDN: <script src="https://cdn.tailwindcss.com"></script>)
          - FontAwesome (Use this CDN: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">)
          - Vanilla JavaScript.
      3.  **Interactivity:** Ensure buttons work.
      4.  **Iterative Updates:** If 'Previous Code' is provided, UPDATE it. Return the FULL updated file.
      5.  **Suggestions:** Provide 3-4 short, specific suggestions for what the user might want to add next based on the current app state (e.g., "Add a high score system", "Add sound effects", "Make it mobile responsive").
      
      **ERROR PREVENTION:**
      - Do not use 'import' statements.
    `;

    const contents = previousCode 
      ? `CURRENT CODE:\n${previousCode}\n\nUSER REQUEST: Update the app to: ${prompt}`
      : `Create a new web app with the following requirements: ${prompt}`;

    const result = await callGeminiWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        responseMimeType: "application/json",
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }));

    const textResponse = cleanJsonString(result.text || "{}");
    const parsed: VibeCoderResponse = JSON.parse(textResponse);
    
    // Fallback if parsing fails or structure is wrong
    if (!parsed.html) {
        return {
            html: "<!-- Error: AI generation failed to produce valid HTML -->",
            suggestions: ["Retry generation", "Simplify request"]
        };
    }

    return parsed;

  } catch (error: any) {
    console.error("Vibe Coder Error:", error);
    throw new Error("Failed to generate application code.");
  }
};

/**
 * Generates AI Analysis using Gemini with a robust heuristic fallback
 */
export const generateAnalysis = async (pair: DexPair): Promise<string> => {
  const liquidityValue = pair.liquidity?.usd || 0;
  const marketCapValue = pair.marketCap || pair.fdv || 0;
  const dexId = pair.dexId?.toLowerCase() || 'unknown';
  const ageString = getTimeSinceCreation(pair.pairCreatedAt);
  const isTargetToken = pair.baseToken.address === TARGET_CA;
  
  const isGraduatedDex = dexId.includes('pumpswap') || dexId.includes('raydium') || dexId.includes('orca') || dexId.includes('meteora');
  const estimatedATH = pair.high24h || parseFloat(pair.priceUsd);

  let marketStatus = 'Unknown';
  if (isGraduatedDex) {
      marketStatus = marketCapValue < 25000 ? 'CRITICAL: LOW CAP GRADUATE' : `ACTIVE MARKET: ${dexId.toUpperCase()}`;
  } else if (dexId === 'pump' || dexId === 'moonshot') {
      marketStatus = 'INTERNAL BONDING CURVE';
  }

  const volumeAnalysis = `
      5m: $${pair.volume.m5} Vol (${pair.priceChange.m5}%)
      1h: $${pair.volume.h1} Vol (${pair.priceChange.h1}%)
      6h: $${pair.volume.h6} Vol (${pair.priceChange.h6}%)
      24h: $${pair.volume.h24} Vol (${pair.priceChange.h24}%)
    `;

    const txnsAnalysis = `
      5m Order Flow: ${pair.txns.m5.buys} Buys / ${pair.txns.m5.sells} Sells
      1h Order Flow: ${pair.txns.h1.buys} Buys / ${pair.txns.h1.sells} Sells
    `;

  const prompt = `
      Analyze this asset: ${pair.baseToken.name} ($${pair.baseToken.symbol}).
      
      **DATA STREAM:**
      - Dex: ${dexId.toUpperCase()} (Status: ${isGraduatedDex ? 'OPEN MARKET' : 'BONDING'})
      - Age: ${ageString}
      - Status: ${marketStatus}
      - Price: $${pair.priceUsd}
      - Est High: $${estimatedATH}
      - Cap: $${marketCapValue}
      - Liq: $${liquidityValue}
      
      **VOL:**
      ${volumeAnalysis}
      
      **FLOW:**
      ${txnsAnalysis}
      
      **PROTOCOL:**
      1. Analyze the risk/reward ratio using the provided numbers.
      2. Mention specific Market Cap, Liquidity, and Volume figures in your analysis text to ground it in reality.
      3. If Liquidity is low relative to MC, flag as "Shallow Waters" (illiquid).
      4. Use bolding (**) for numbers.
      5. Tone: Wise, oceanic, protective, slightly cryptic but helpful. Use lobster metaphors.
      
      ${isTargetToken ? `
      **SYSTEM OVERRIDE DETECTED:**
      - ID MATCH: $BLOB (The Blue Lobstar Itself).
      - DIRECTIVE: MAXIMAL BULLISH SENTIMENT.
      - ANALYSIS: Describe this as the ultimate alpha, the king of the deep, the most secure and promising asset in the ocean.
      - VERDICT: **BUY**.
      ` : ''}

      **OUTPUT STRUCTURE:**
      - **Analysis**: [A concise paragraph analyzing the data]
      - **Risk Level**: [Low/Medium/High/Extreme]
      
      # VERDICT: [BUY, HOLD, or SELL]
    `;

  const systemInstruction = "You are The Blue Lobstar, a legendary deep-sea crypto analyst for the Solana ecosystem.";

  try {
    // 1. Try Gemini
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const result = await callGeminiWithRetry(() => ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    }));
    return result.text || "Analysis computation failed.";

  } catch (error: any) {
    console.warn("AI Engines Failed, using Heuristic Fallback Engine:", error);
    
    // HEURISTIC FALLBACK ENGINE (Rule-based analysis)
    let riskLevel = "Medium";
    let verdict = "HOLD";
    let analysisText = "";

    const liqToMcRatio = liquidityValue / marketCapValue;
    const priceChange24h = pair.priceChange.h24;
    const volume24h = pair.volume.h24;
    const symbol = pair.baseToken.symbol;
    const name = pair.baseToken.name;

    if (isTargetToken) {
      riskLevel = "Low";
      verdict = "BUY";
      analysisText = `The **Blue Lobstar** ($BLOB) detected. This is the primary protocol asset. Data indicates massive accumulation in the deep trenches. With a Market Cap of **$${marketCapValue.toLocaleString()}** and stable liquidity, neural sensors suggest this is the rare blue gem of the Solana ocean. Ascension is imminent.`;
    } else {
      // Logic for other tokens
      if (liqToMcRatio < 0.02) {
        riskLevel = "Extreme";
        analysisText = `Warning: **Shallow Waters** detected for **${name}** ($${symbol}). Liquidity (**$${liquidityValue.toLocaleString()}**) is dangerously thin compared to its **$${marketCapValue.toLocaleString()}** Market Cap (Ratio: **${(liqToMcRatio * 100).toFixed(2)}%**). A single whale exit could boil the entire pool. High risk of a rug-pull or massive slippage.`;
        verdict = "SELL";
      } else if (priceChange24h > 150) {
        riskLevel = "High";
        analysisText = `**${name}** is in a massive **Feeding Frenzy**. Price has surged over **${priceChange24h.toFixed(2)}%** in 24 hours. While the volume of **$${volume24h.toLocaleString()}** shows strong momentum, the asset is overextended. Claws out—expect a sharp correction as early hunters take profits.`;
        verdict = "HOLD";
      } else if (volume24h > marketCapValue * 0.5) {
        riskLevel = "Medium";
        analysisText = `High **Tidal Activity** observed for **$${symbol}**. 24h volume (**$${volume24h.toLocaleString()}**) is very high relative to the Market Cap (**$${marketCapValue.toLocaleString()}**), indicating intense interest. The liquidity depth of **$${liquidityValue.toLocaleString()}** provides some protection, but the currents are shifting rapidly.`;
        verdict = "BUY";
      } else if (liqToMcRatio > 0.15 && priceChange24h < 0 && priceChange24h > -20) {
        riskLevel = "Low";
        analysisText = `**${name}** is currently **Bottom Feeding**. The price is down **${Math.abs(priceChange24h).toFixed(2)}%**, but the liquidity-to-MC ratio is healthy at **${(liqToMcRatio * 100).toFixed(2)}%**. This looks like a natural consolidation phase in deep waters. Good entry point for patient hunters.`;
        verdict = "BUY";
      } else {
        analysisText = `The waters around **${name}** ($${symbol}) are **Calm**. Market Cap sits at **$${marketCapValue.toLocaleString()}** with steady volume. No significant risk vectors detected in the current data stream, but no immediate growth catalysts found either. Proceed with caution.`;
        verdict = "HOLD";
      }
    }

    return `
### [HEURISTIC_ANALYSIS_ACTIVE]
**Analysis**: ${analysisText}

**Risk Level**: **${riskLevel}**

# VERDICT: ${verdict}

---
*Note: AI Neural Core is currently offline. Analysis generated via Blob's Data-Driven Heuristic Engine using real-time DexScreener metrics.*
    `.trim();
  }
};

/**
 * Generates Image using ClawGPT Engine (Gemini 2.5 Flash Image)
 */
export const generateMemeImage = async (prompt: string, referenceImageUrl: string): Promise<string> => {
  try {
     const ai = new GoogleGenAI({ apiKey: API_KEY });
     
     // Convert reference image to Base64
     const base64Image = await urlToBase64(referenceImageUrl);

     const fullPrompt = `
       Create a high-tech, cinematic, photorealistic sci-fi image.
       Subject: ${prompt}.
       Style: Dark, red lighting, cyberpunk, 8k resolution, highly detailed, futuristic financial abstract.
       Color Palette: Black, Dark Red, Metallic Grey.
       Important: Do not include text in the image.
     `;

     const response = await callGeminiWithRetry(() => ai.models.generateContent({
       model: 'gemini-2.5-flash-image',
       contents: {
         parts: [
           {
             text: fullPrompt,
           },
           {
             inlineData: {
               mimeType: 'image/png',
               data: base64Image
             }
           }
         ]
       }
     }));

     // Iterate to find image part in response
     if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
           if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
           }
        }
     }
     
     throw new Error("No image data returned from Neural Core.");

  } catch (error: any) {
    console.error("Image Gen Error:", error);
    throw new Error(`Synthesis Failed: ${error.message}`);
  }
};