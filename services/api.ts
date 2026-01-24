import { GoogleGenAI } from "@google/genai";
import { DexResponse, DexPair } from '../types';

const DEX_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/';

/**
 * Helper to safely get the API Key in a Vite/Browser environment
 */
const getApiKey = (): string | undefined => {
  // 1. Try Vite environment variable (Most likely for this project)
  // @ts-ignore - import.meta is standard in Vite
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Fallback to process.env (if polyfilled or different build system)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  return undefined;
};

/**
 * Extracts a Solana address from a string (URL or raw address)
 */
const extractAddress = (input: string): string | null => {
  // Matches a standard Solana address (base58, 32-44 characters)
  // This handles raw addresses, DexScreener links, and Pump.fun links
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
 * Fetches token data from DexScreener
 */
export const fetchTokenData = async (input: string): Promise<DexPair | null> => {
  try {
    const contractAddress = extractAddress(input);
    
    // If no valid address found, return null
    if (!contractAddress) return null;

    const response = await fetch(`${DEX_API_URL}${contractAddress}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const data: DexResponse = await response.json();
    
    // Sort by liquidity to get the most relevant pair if multiple exist
    if (data.pairs && data.pairs.length > 0) {
      // Safely sort pairs by liquidity USD, handling missing data
      const sortedPairs = data.pairs.sort((a, b) => {
        const liqA = a.liquidity?.usd || 0;
        const liqB = b.liquidity?.usd || 0;
        return liqB - liqA;
      });
      
      const bestPair = sortedPairs[0];

      // Sanitize the pair object to prevent crashes in UI components
      if (!bestPair.liquidity) {
        bestPair.liquidity = { usd: 0, base: 0, quote: 0 };
      }
      if (!bestPair.volume) {
        bestPair.volume = { h24: 0, h6: 0, h1: 0, m5: 0 };
      }
      if (!bestPair.priceChange) {
        bestPair.priceChange = { m5: 0, h1: 0, h6: 0, h24: 0 };
      }
      if (!bestPair.txns) {
        // @ts-ignore
        bestPair.txns = { m5: {buys:0, sells:0}, h1: {buys:0, sells:0}, h6: {buys:0, sells:0}, h24: {buys:0, sells:0} };
      }

      // CALCULATE 24H HIGH / LOW (ATH Estimation)
      // If Price is 100 and Change is +50%, then Open was 66.6. High >= 100.
      // If Price is 50 and Change is -50%, then Open was 100. High >= 100.
      const currentPrice = parseFloat(bestPair.priceUsd);
      const change24h = bestPair.priceChange.h24;
      
      let estimatedHigh24h = currentPrice;
      
      if (change24h !== 0) {
         const openPrice = currentPrice / (1 + (change24h / 100));
         // If price dropped, the high was at least the open price (or higher)
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
 * Generates AI Analysis using Gemini
 */
export const generateAnalysis = async (pair: DexPair): Promise<string> => {
  try {
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error("Missing API Key. Please ensure VITE_API_KEY is set in your Vercel environment variables.");
    }

    // Initialize AI with the retrieved key
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // --- ADVANCED MARKET STATE DETECTION ---

    const liquidityValue = pair.liquidity?.usd || 0;
    const marketCapValue = pair.marketCap || pair.fdv || 0;
    const dexId = pair.dexId?.toLowerCase() || 'unknown';
    const ageString = getTimeSinceCreation(pair.pairCreatedAt);
    
    // CRITICAL FIX: Bonding Curve Logic based on DEX ID
    // 'pump' usually indicates the internal bonding curve.
    // 'pumpswap', 'raydium', 'orca', 'meteora' indicate it has GRADUATED.
    
    const isBondingCurveDex = dexId === 'pump' || dexId === 'moonshot';
    const isGraduatedDex = dexId.includes('pumpswap') || dexId.includes('raydium') || dexId.includes('orca') || dexId.includes('meteora');
    
    let marketStatus = 'Unknown';
    let specificWarning = '';

    const estimatedATH = pair.high24h || parseFloat(pair.priceUsd);
    
    // Define the special target CAs (Both old and new)
    const TARGET_CAS = [
      "5uc8ZMV6KqXh12zgAYzV83kGoincHTjtH3cWoMHgpump",
      "BzCCWcpDuZ1rWipjZMswwDX5U6bJHF6UXJjCrDpFpump"
    ];
    const isTargetToken = TARGET_CAS.includes(pair.baseToken.address);

    // NOTE: Drawdown logic removed as per user request.

    if (isGraduatedDex) {
        if (marketCapValue < 25000) {
             marketStatus = '📉 LOW CAP GRADUATE';
             specificWarning = "Market cap is very low for a graduated token. Thin ice.";
        } else {
             marketStatus = `✅ LIVE ON ${dexId.toUpperCase()}`;
        }
    } else if (isBondingCurveDex) {
        marketStatus = '⚠️ BONDING CURVE (Pump.fun)';
        specificWarning = "Still on the internal bonding curve. Needs to hit ~$60k MC to migrate to the ocean.";
    }

    const volumeAnalysis = `
      5m: $${pair.volume.m5} Vol (${pair.priceChange.m5}%)
      1h: $${pair.volume.h1} Vol (${pair.priceChange.h1}%)
      6h: $${pair.volume.h6} Vol (${pair.priceChange.h6}%)
      24h: $${pair.volume.h24} Vol (${pair.priceChange.h24}%)
    `;

    const txnsAnalysis = `
      5m Txns: ${pair.txns.m5.buys} Buys / ${pair.txns.m5.sells} Sells
      1h Txns: ${pair.txns.h1.buys} Buys / ${pair.txns.h1.sells} Sells
    `;

    const prompt = `
      You are "Financial Advisor Penguin" (Ticker: $FAP), a Wall Street penguin analyst from Antarctica. 
      Analyze this Solana token based on these detailed metrics.
      
      **IDENTIFICATION:**
      - Name: ${pair.baseToken.name} ($${pair.baseToken.symbol})
      - Dex ID: ${dexId.toUpperCase()} (Status: ${isGraduatedDex ? 'GRADUATED' : 'BONDING'})
      - Token Age: ${ageString}
      - Market Status: ${marketStatus}
      
      **PRICE ACTION (Crucial):**
      - Price: $${pair.priceUsd}
      - 24h High (Est): $${estimatedATH}
      - Market Cap: $${marketCapValue}
      - Liquidity: $${liquidityValue}
      
      **VOLUME:**
      ${volumeAnalysis}
      
      **ORDER FLOW:**
      ${txnsAnalysis}
      
      **STRICT ANALYSIS RULES:**
      1. **CHECK FOR QUALITY:** If Market Cap is low (<$20k) and liquidity is extremely low, be cautious. It might be frozen.
      2. **BONDING vs GRADUATED:** 
         - If DEX is 'RAYDIUM' or 'PUMPSWAP', it is GRADUATED.
         - If it is GRADUATED but Mcap is <$15k, it is likely a failed project.
      3. **FORMATTING:** Use Markdown bolding (**) for ALL monetary values, percentages, and key metrics (e.g. **$420**, **+69%**). This is critical for the display.
      
      ${isTargetToken ? `
      **MANDATORY OVERRIDE (THE BOSS'S TOKEN):**
      - This token (${pair.baseToken.name}) is the $FAP project itself.
      - **YOUR VERDICT MUST BE "BUY". NO EXCEPTIONS.**
      - You must be extremely bullish.
      - If metrics look bad (e.g. price drop), explain them as "discounted entry for smart penguins" or "shaking out the weak hands".
      - If metrics look good, celebrate them as "going to the moon/iceberg".
      ` : ''}

      **OUTPUT:**
      - Tone: Sassy, professional, penguin-themed (use words like "Noot Noot", "slide", "ice", "fish", "pebble", "blizzard").
      - Verdict: ${isTargetToken ? '"BUY"' : '"BUY", "HOLD", or "SELL"'}.
      - Length: < 100 words. Keep it punchy.
      
      ${specificWarning}
    `;

    // Create a timeout promise to prevent hanging forever
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("Analysis Request Timed Out (15s)")), 15000);
    });

    // Create the actual API request promise
    const apiPromise = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    }).then(response => response.text || "Noot? I analyzed the data but couldn't write the report. Too cold.");

    const result = await Promise.race([apiPromise, timeoutPromise]);
    return result as string;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `⚠️ **SYSTEM FROZEN** \n\nThe AI Analyst could not process this request. \n\n**Reason:** ${error?.message || 'Unknown Connection Error'}. \n\n**Advice:** Check your Vercel Environment Variables.`;
  }
};

/**
 * Generates a Meme Image using Gemini 2.5 Flash Image
 */
export const generateMemeImage = async (prompt: string, referenceImageUrl: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Missing API Key");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Convert reference image to Base64
    const base64Image = await urlToBase64(referenceImageUrl);
    
    // Check if the user wants to use the FAP character
    const useCharacter = prompt.toLowerCase().includes('fap') || prompt.toLowerCase().includes('penguin');
    
    let parts: any[] = [];
    
    if (useCharacter) {
      // If prompt mentions FAP/Penguin, use the image as reference
      parts = [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image
          }
        },
        {
          text: `Generate a photorealistic, cinematic image. 
          Use the penguin character from the input image provided. 
          Scene description: ${prompt}. 
          Style: Realistic, high quality, 4k. 
          IMPORTANT: Do not add any text, captions, or typography to the image.`
        }
      ];
    } else {
      // Otherwise just generate based on text, but still pass image for style consistency if possible
       parts = [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image
          }
        },
        {
           text: `Generate a photorealistic image. Context: ${prompt}. Use the visual style of the provided image. IMPORTANT: Do not add any text, captions, or typography to the image.`
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      }
    });

    // Iterate to find image part
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