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
    
    // Pump.fun detection and Bonding Curve Logic
    const isPumpFun = pair.baseToken.address.toLowerCase().endsWith('pump');
    const liquidityValue = pair.liquidity?.usd || 0;
    const marketCapValue = pair.marketCap || pair.fdv || 0;

    // Logic: If it's Pump.fun and has low liquidity OR low Mcap, it's likely still on the Bonding Curve.
    // Standard graduation is around $60k-$69k Mcap.
    const isOnBondingCurve = isPumpFun && (liquidityValue < 3000 || marketCapValue < 65000);

    const liquidityDisplay = isOnBondingCurve 
      ? "Bonding Curve Phase (Liquidity not yet seeded on PumpSwap)" 
      : `$${liquidityValue}`;

    const prompt = `
      You are "Financial Advisor Pussy" (Ticker: $FAP), a professional, high-frequency trading cat analyst on Wall Street. You use professional financial jargon mixed with cat behavior.
      
      Analyze the following asset based on this real-time market data:
      
      **Asset Profile:**
      - Name: ${pair.baseToken.name} ($${pair.baseToken.symbol})
      - Address: ${pair.baseToken.address}
      - Origin: ${isPumpFun ? 'Pump.fun 💊' : 'Standard Solana SPL'}
      - Status: ${isOnBondingCurve ? '⚠️ PRE-BONDING (Still on Curve)' : 'Active Market'}
      
      **Market Metrics:**
      - Price: $${pair.priceUsd}
      - Market Cap: $${marketCapValue}
      - Liquidity Pool: ${liquidityDisplay}
      - 24h Volume: $${pair.volume?.h24 || 0}
      - 24h Momentum: ${pair.priceChange?.h24 || 0}%
      
      **Instructions:**
      1. **Tone:** Professional, analytical, but slightly condescending (like a senior banker cat). Use terms like "bullish divergence," "liquidity crunch," "sentiment analysis," and "meow-mentum."
      2. **Risk Assessment:**
         ${isOnBondingCurve 
          ? "- IMPORTANT: This token is on the Pump.fun BONDING CURVE. Zero/Low Liquidity is NORMAL in this phase. Do NOT flag '0 Liquidity' as a rug risk or bearish. Liquidity will be seeded on PumpSwap upon graduation. Judge solely on Volume and potential to graduate (reach $69k Mcap)." 
          : isPumpFun 
            ? "- Pump.fun Graduate. Check if liquidity > $10k. If not, flag as dangerous."
            : "- Check Liquidity to Mcap ratio. If liquidity is < $10k, flag as 'Liquidity Crisis'."
         }
      3. **Volume Analysis:** Is the volume high compared to Mcap? If yes, mention "High speculative interest."
      4. **Verdict:** End with a clear recommendation: "BUY POSITION", "HOLD", or "LIQUIDATE IMMEDIATELY".
      5. **Format:** Keep it under 150 words. Use emojis sparingly but effectively (📉, 📈, 🚨, 😺).
    `;

    // Create a timeout promise to prevent hanging forever
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("Analysis Request Timed Out (15s)")), 15000);
    });

    // Create the actual API request promise
    const apiPromise = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    }).then(response => response.text || "Meow? I analyzed the data but couldn't write the report.");

    // Race them: whichever finishes first wins
    const result = await Promise.race([apiPromise, timeoutPromise]);
    
    return result as string;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return a visible error message to the UI instead of crashing/hanging
    return `⚠️ **SYSTEM MALFUNCTION** \n\nThe AI Analyst could not process this request. \n\n**Reason:** ${error?.message || 'Unknown Connection Error'}. \n\n**Advice:** Check your Vercel Environment Variables. Ensure 'VITE_API_KEY' is set correctly.`;
  }
};