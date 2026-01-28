import { GoogleGenAI } from "@google/genai";
import { DexResponse, DexPair, AnalysisResult, AnalysisSource } from '../types';

const DEX_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/';

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

/**
 * Calculates Risk and Health Scores based on raw data
 */
const calculateMetrics = (pair: DexPair) => {
    const liq = pair.liquidity?.usd || 0;
    const mcap = pair.marketCap || pair.fdv || 1; // avoid divide by zero
    
    // Liquidity Health: Percentage of Mcap that is in Liquidity.
    // Healthy > 15%, Thin < 5%
    const liqRatio = (liq / mcap) * 100;
    const liquidityHealth = Math.min(Math.max(liqRatio, 0), 100); 

    // Risk Score: Composite of low liquidity, high volatility, low age
    // Start at 0 (Safe)
    let risk = 0;
    
    // Penalty for low liquidity ratio
    if (liqRatio < 5) risk += 40;
    else if (liqRatio < 10) risk += 20;

    // Penalty for very low raw liquidity
    if (liq < 5000) risk += 30;
    
    // Penalty for extreme recent volatility (pump and dump risk)
    if (Math.abs(pair.priceChange.h1) > 50) risk += 20;

    return {
        riskScore: Math.min(risk, 100),
        liquidityHealth: liquidityHealth
    };
};

export const generateAnalysis = async (pair: DexPair): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const { riskScore, liquidityHealth } = calculateMetrics(pair);

    const liquidityValue = pair.liquidity?.usd || 0;
    const marketCapValue = pair.marketCap || pair.fdv || 0;
    const dexId = pair.dexId?.toLowerCase() || 'unknown';
    const ageString = getTimeSinceCreation(pair.pairCreatedAt);
    
    const isBondingCurveDex = dexId === 'pump' || dexId === 'moonshot';
    const isGraduatedDex = dexId.includes('pumpswap') || dexId.includes('raydium') || dexId.includes('orca') || dexId.includes('meteora');
    
    let marketStatus = 'Unknown';
    if (isGraduatedDex) {
        if (marketCapValue < 25000) marketStatus = '📉 LOW CAP GRADUATE';
        else marketStatus = `✅ LIVE ON ${dexId.toUpperCase()}`;
    } else if (isBondingCurveDex) {
        marketStatus = '⚠️ BONDING CURVE';
    }

    const TARGET_CA = "xxxxxxxxxxxxxxxxxxxxx";
    const isTargetToken = pair.baseToken.address === TARGET_CA;

    const prompt = `
      You are "Financial Advisor Pigeon" (Ticker: $FAP), a professional Wall Street pigeon analyst. 
      Analyze this Solana token ($${pair.baseToken.symbol}).
      
      **SEARCH REQUIREMENT:**
      Use your Google Search tool to find recent news, Twitter/X posts, or community sentiment about "$${pair.baseToken.symbol} Solana" or the token address.
      
      **DATA PROFILE:**
      - Price: $${pair.priceUsd}
      - MCap: $${marketCapValue}
      - Liquidity: $${liquidityValue} (Health: ${liquidityHealth.toFixed(1)}%)
      - Dex: ${dexId.toUpperCase()}
      - Age: ${ageString}
      - Risk Calculation: ${riskScore}/100
      
      **ANALYSIS RULES:**
      1. Use the Search results to mention if there is "FUD", "Hype", or "Silence" online.
      2. Analyze the Liquidity Health. Is it too thin?
      3. ${isTargetToken ? 'MANDATORY: This is $FAP (Our Coin). VERDICT IS ALWAYS BUY. Be extremely bullish.' : 'Be objective. If liquidity is low and search results are empty, warn the user.'}
      
      **OUTPUT STYLE:**
      - Professional yet sassy Pigeon persona (mention "seeds", "coo", "risky flight").
      - Use Markdown for **bolding** key numbers.
      - Verdict: "BUY", "SELL", or "HOLD".
      - Keep it under 150 words.
    `;

    // Use gemini-3-flash-preview for tools support
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "Coo? I couldn't write the report. The wind is too strong.";
    
    // Extract Grounding Sources
    const sources: AnalysisSource[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                sources.push({
                    title: chunk.web.title,
                    uri: chunk.web.uri
                });
            }
        });
    }

    return {
        text,
        sources,
        riskScore,
        liquidityHealth
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return a safe fallback object
    return {
        text: `⚠️ **SYSTEM ERROR** \n\nThe AI Analyst could not process this request. \n\n**Reason:** ${error?.message || 'Unknown Connection Error'}.`,
        sources: [],
        riskScore: 50,
        liquidityHealth: 0
    };
  }
};

export const generateMemeImage = async (prompt: string, referenceImageUrl: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Image = await urlToBase64(referenceImageUrl);
    const useCharacter = prompt.toLowerCase().includes('fap') || prompt.toLowerCase().includes('pigeon');
    
    let parts: any[] = [];
    if (useCharacter) {
      parts = [
        { inlineData: { mimeType: 'image/png', data: base64Image } },
        { text: `Generate a photorealistic, cinematic image. Use the pigeon character from the input image. Scene: ${prompt}. Style: Realistic, 4k. No text.` }
      ];
    } else {
       parts = [
        { inlineData: { mimeType: 'image/png', data: base64Image } },
        { text: `Generate a photorealistic image. Context: ${prompt}. Use style of provided image. No text.` }
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Meme Generation Error:", error);
    throw error;
  }
};