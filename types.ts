export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  high24h?: number; // Calculated field
  low24h?: number;  // Calculated field
}

export interface DexResponse {
  schemaVersion: string;
  pairs: DexPair[];
}

export interface AnalysisSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  text: string;
  sources: AnalysisSource[];
  riskScore: number; // 0-100 (0 = Safe, 100 = Rug Risk)
  liquidityHealth: number; // 0-100 (Liquidity to FDV ratio normalized)
}

export enum AnalysisStatus {
  IDLE,
  FETCHING_DATA,
  ANALYZING,
  COMPLETE,
  ERROR
}