import React from 'react';
import { DexPair } from '../types';
import { DollarSign, Activity, BarChart2, TrendingUp, TrendingDown, Clock, Layers, ShieldCheck } from 'lucide-react';

interface StatsGridProps {
  pair: DexPair;
}

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return 'N/A';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${value.toFixed(4)}`;
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
      <td className="py-3 px-4 font-mono text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</td>
      <td className={`py-3 px-4 font-mono text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <div className="flex items-center gap-1">
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </td>
      <td className="py-3 px-4 font-mono text-xs text-stone-400">{formatCurrency(vol)}</td>
      <td className="py-3 px-4 min-w-[140px]">
        <div className="flex flex-col gap-1.5 w-full">
           <div className="flex justify-between text-[9px] font-mono font-medium text-stone-600">
             <span className="text-stone-400">Buys: {buys}</span>
             <span className="text-stone-400">Sells: {sells}</span>
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
    <div className="w-full flex flex-col gap-4 animate-slide-up">
       
       {/* Top Metrics Row */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Price Card */}
          <div className="bg-obsidian-900/80 border border-claw-900/30 p-4 rounded-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-transform">
               <DollarSign size={64} className="text-claw-700" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-2">Asset Price</p>
             <p className="text-xl md:text-2xl font-mono font-black text-white">
                {formatPrice(pair.priceUsd)}
             </p>
             <div className="flex items-center gap-1 mt-2">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border bg-obsidian-950 ${dropFromHigh < -20 ? 'border-red-900 text-red-500' : 'border-green-900 text-green-500'}`}>
                    Deviation: {dropFromHigh.toFixed(1)}%
                </span>
             </div>
          </div>

          {/* Market Cap */}
          <div className="bg-obsidian-900/80 border border-claw-900/30 p-4 rounded-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-transform">
               <Activity size={64} className="text-claw-700" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-2">Valuation (MC)</p>
             <p className="text-xl font-mono font-black text-white">{formatCurrency(mcap)}</p>
             <p className="text-[9px] text-stone-600 font-mono mt-1">FDV: {formatCurrency(pair.fdv)}</p>
          </div>

          {/* Liquidity */}
          <div className="bg-obsidian-900/80 border border-claw-900/30 p-4 rounded-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-transform">
               <Layers size={64} className="text-claw-700" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-2">Liquidity Depth</p>
             <p className="text-xl font-mono font-black text-white">{formatCurrency(pair.liquidity.usd)}</p>
          </div>

          {/* Age */}
          <div className="bg-obsidian-900/80 border border-claw-900/30 p-4 rounded-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-transform">
               <Clock size={64} className="text-claw-700" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-claw-500 mb-2">Inception Date</p>
             <p className="text-sm font-mono font-bold text-white mt-1">
                {new Date(pair.pairCreatedAt).toLocaleDateString()}
             </p>
          </div>
       </div>

       {/* Detailed Data Table */}
       <div className="bg-obsidian-900/80 border border-claw-900/30 rounded-sm overflow-hidden backdrop-blur-sm">
         <div className="px-4 py-3 bg-obsidian-950 border-b border-claw-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-claw-500" />
                <h3 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Momentum Matrix</h3>
            </div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-obsidian-950 border-b border-claw-900/20">
                 <th className="py-2 px-4 text-[9px] uppercase text-stone-500 font-bold tracking-wider">Interval</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-stone-500 font-bold tracking-wider">Net Change</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-stone-500 font-bold tracking-wider">Volume</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-stone-500 font-bold tracking-wider w-1/3">Pressure</th>
               </tr>
             </thead>
             <tbody>
                <TimeframeRow 
                  label="5 MIN" 
                  change={pair.priceChange.m5} 
                  vol={pair.volume.m5} 
                  buys={pair.txns.m5.buys} 
                  sells={pair.txns.m5.sells} 
                />
                <TimeframeRow 
                  label="1 HOUR" 
                  change={pair.priceChange.h1} 
                  vol={pair.volume.h1} 
                  buys={pair.txns.h1.buys} 
                  sells={pair.txns.h1.sells} 
                />
                <TimeframeRow 
                  label="6 HOURS" 
                  change={pair.priceChange.h6} 
                  vol={pair.volume.h6} 
                  buys={pair.txns.h6.buys} 
                  sells={pair.txns.h6.sells} 
                />
                <TimeframeRow 
                  label="24 HOURS" 
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