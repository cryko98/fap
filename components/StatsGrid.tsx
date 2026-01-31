import React from 'react';
import { DexPair } from '../types';
import { DollarSign, Activity, BarChart2, TrendingUp, TrendingDown, Clock, Layers } from 'lucide-react';

interface StatsGridProps {
  pair: DexPair;
}

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return 'N/A';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatPrice = (price: string) => {
    const p = parseFloat(price);
    if (p < 0.000001) return price; 
    return `$${p.toFixed(8)}`;
};

const TimeframeRow = ({ label, change, vol, buys, sells }: { label: string, change: number, vol: number, buys: number, sells: number }) => {
  const isPositive = change >= 0;
  const total = buys + sells;
  const buyPercentage = total > 0 ? (buys / total) * 100 : 0;
  
  return (
    <tr className="border-b border-claw-900/20 last:border-0 hover:bg-claw-900/5 transition-colors group">
      <td className="py-3 px-3 md:px-4 font-mono text-[9px] md:text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</td>
      <td className={`py-3 px-3 md:px-4 font-mono text-[10px] md:text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <div className="flex items-center gap-1">
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </td>
      <td className="py-3 px-3 md:px-4 font-mono text-[10px] md:text-xs text-stone-400">{formatCurrency(vol)}</td>
      <td className="py-3 px-3 md:px-4 min-w-[120px] md:min-w-[140px]">
        <div className="flex flex-col gap-1 w-full">
           <div className="flex justify-between text-[8px] md:text-[9px] font-mono font-medium text-stone-600">
             <span>B: {buys}</span>
             <span>S: {sells}</span>
           </div>
           <div className="w-full h-1 bg-obsidian-800 rounded-sm overflow-hidden flex relative">
             <div className="h-full bg-claw-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]" style={{ width: `${buyPercentage}%` }}></div>
           </div>
        </div>
      </td>
    </tr>
  );
};

export const StatsGrid: React.FC<StatsGridProps> = ({ pair }) => {
  const mcap = pair.marketCap || pair.fdv;
  const high24h = pair.high24h || 0;
  const currentPrice = parseFloat(pair.priceUsd);
  const dropFromHigh = high24h > 0 ? ((currentPrice - high24h) / high24h) * 100 : 0;
  
  return (
    <div className="w-full flex flex-col gap-3 md:gap-4 animate-slide-up">
       
       {/* Metrics Cards */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <div className="bg-obsidian-900/80 border border-claw-900/30 p-3 md:p-4 rounded-sm relative overflow-hidden">
             <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-1 md:mb-2">Price</p>
             <p className="text-sm md:text-xl font-mono font-black text-white truncate">
                {formatPrice(pair.priceUsd)}
             </p>
             <div className={`text-[8px] font-mono mt-1 ${dropFromHigh < -20 ? 'text-red-500' : 'text-green-500'}`}>
                Dev: {dropFromHigh.toFixed(1)}%
             </div>
          </div>

          <div className="bg-obsidian-900/80 border border-claw-900/30 p-3 md:p-4 rounded-sm relative overflow-hidden">
             <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-1 md:mb-2">MCap</p>
             <p className="text-sm md:text-xl font-mono font-black text-white">{formatCurrency(mcap)}</p>
             <p className="text-[8px] text-stone-600 font-mono mt-1">FDV: {formatCurrency(pair.fdv)}</p>
          </div>

          <div className="bg-obsidian-900/80 border border-claw-900/30 p-3 md:p-4 rounded-sm relative overflow-hidden">
             <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-1 md:mb-2">Liquidity</p>
             <p className="text-sm md:text-xl font-mono font-black text-white">{formatCurrency(pair.liquidity.usd)}</p>
          </div>

          <div className="bg-obsidian-900/80 border border-claw-900/30 p-3 md:p-4 rounded-sm relative overflow-hidden">
             <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-1 md:mb-2">Created</p>
             <p className="text-[10px] md:text-sm font-mono font-bold text-white mt-1">
                {new Date(pair.pairCreatedAt).toLocaleDateString()}
             </p>
          </div>
       </div>

       {/* Matrix Table */}
       <div className="bg-obsidian-900/80 border border-claw-900/30 rounded-sm overflow-hidden backdrop-blur-sm">
         <div className="px-3 md:px-4 py-2 md:py-3 bg-obsidian-950 border-b border-claw-900/30 flex items-center gap-2">
            <BarChart2 size={14} className="text-claw-500" />
            <h3 className="text-[9px] md:text-[10px] font-bold text-stone-300 uppercase tracking-widest">Momentum Matrix</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse min-w-[320px]">
             <thead>
               <tr className="bg-obsidian-950 border-b border-claw-900/20">
                 <th className="py-2 px-3 md:px-4 text-[8px] md:text-[9px] uppercase text-stone-500 font-bold tracking-wider">Interval</th>
                 <th className="py-2 px-3 md:px-4 text-[8px] md:text-[9px] uppercase text-stone-500 font-bold tracking-wider">Change</th>
                 <th className="py-2 px-3 md:px-4 text-[8px] md:text-[9px] uppercase text-stone-500 font-bold tracking-wider">Vol</th>
                 <th className="py-2 px-3 md:px-4 text-[8px] md:text-[9px] uppercase text-stone-500 font-bold tracking-wider">Pressure</th>
               </tr>
             </thead>
             <tbody>
                <TimeframeRow 
                  label="5M" 
                  change={pair.priceChange.m5} 
                  vol={pair.volume.m5} 
                  buys={pair.txns.m5.buys} 
                  sells={pair.txns.m5.sells} 
                />
                <TimeframeRow 
                  label="1H" 
                  change={pair.priceChange.h1} 
                  vol={pair.volume.h1} 
                  buys={pair.txns.h1.buys} 
                  sells={pair.txns.h1.sells} 
                />
                <TimeframeRow 
                  label="6H" 
                  change={pair.priceChange.h6} 
                  vol={pair.volume.h6} 
                  buys={pair.txns.h6.buys} 
                  sells={pair.txns.h6.sells} 
                />
                <TimeframeRow 
                  label="24H" 
                  change={pair.priceChange.h24} 
                  vol={pair.volume.h24} 
                  buys={pair.txns.h24.buys} 
                  sells={pair.txns.h24.sells} 
                />
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
};