import React from 'react';
import { DexPair } from '../types';
import { DollarSign, Users, Droplets, TrendingUp, TrendingDown, Clock, BarChart2, Snowflake, Bird, MapPin, Wind } from 'lucide-react';

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
  const sellPercentage = total > 0 ? (sells / total) * 100 : 0;
  
  return (
    <tr className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors group">
      <td className="py-3 px-4 font-mono text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</td>
      <td className={`py-3 px-4 font-mono text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        <div className="flex items-center gap-1">
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </td>
      <td className="py-3 px-4 font-mono text-xs text-slate-400">{formatCurrency(vol)}</td>
      <td className="py-3 px-4 min-w-[140px]">
        <div className="flex flex-col gap-1.5 w-full">
           <div className="flex justify-between text-[9px] font-mono font-medium text-slate-500">
             <span className="text-green-500 flex items-center gap-1">B: {buys}</span>
             <span className="text-red-500 flex items-center gap-1">S: {sells}</span>
           </div>
           
           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex relative">
             <div className="h-full bg-green-500 shadow-[0_0_5px_#22c55e]" style={{ width: `${buyPercentage}%` }}></div>
             <div className="h-full bg-red-500 shadow-[0_0_5px_#ef4444]" style={{ width: `${sellPercentage}%` }}></div>
           </div>
        </div>
      </td>
    </tr>
  );
};

export const StatsGrid: React.FC<StatsGridProps> = ({ pair }) => {
  const mcap = pair.marketCap || pair.fdv;
  const liqRatio = mcap > 0 ? (pair.liquidity.usd / mcap) * 100 : 0;
  const high24h = pair.high24h || 0;
  const currentPrice = parseFloat(pair.priceUsd);
  const dropFromHigh = high24h > 0 ? ((currentPrice - high24h) / high24h) * 100 : 0;
  
  return (
    <div className="w-full flex flex-col gap-4 animate-slide-up">
       
       {/* Top Metrics Row - Dark Tech Cards */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Price Card */}
          <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-green-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-transform">
               <DollarSign size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Bird size={14} className="text-fap-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Current Crumb-Price</p>
             </div>
             <p className="text-xl md:text-2xl font-mono font-black tracking-tight text-white drop-shadow-md">
                {formatPrice(pair.priceUsd)}
             </p>
             <div className="flex items-center gap-1 mt-2">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${dropFromHigh < -20 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                    Drop from Roof: {dropFromHigh.toFixed(1)}%
                </span>
             </div>
          </div>

          {/* Market Cap Card */}
          <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-transform">
               <Users size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
               <Users size={14} className="text-blue-400" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Market Pigeon</p>
             </div>
             <p className="text-xl font-mono font-black text-white">{formatCurrency(mcap)}</p>
             <p className="text-[9px] text-slate-500 font-mono mt-1">
                Fully Diluted Wings: {formatCurrency(pair.fdv)}
             </p>
          </div>

          {/* Liquidity Card */}
          <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-transform">
               <Droplets size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
               <Droplets size={14} className="text-cyan-400" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Fountain Depth</p>
             </div>
             <p className="text-xl font-mono font-black text-white">{formatCurrency(pair.liquidity.usd)}</p>
             <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                    className={`h-full ${liqRatio < 5 ? 'bg-red-500' : 'bg-cyan-400'} shadow-[0_0_10px_currentColor]`} 
                    style={{width: `${Math.min(liqRatio * 2, 100)}%`}}
                ></div>
             </div>
             <p className="text-[9px] text-slate-500 mt-1 font-mono text-right">
                Pooled: {liqRatio.toFixed(1)}%
             </p>
          </div>

          {/* Age Card */}
          <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-transform">
               <Clock size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
               <MapPin size={14} className="text-amber-400" />
               <p className="text-[10px] font-bold uppercase tracking-widest">City Time</p>
             </div>
             <p className="text-sm font-mono font-bold text-white mt-1">
                {new Date(pair.pairCreatedAt).toLocaleDateString()}
             </p>
             <p className="text-[9px] text-amber-500/80 font-mono mt-1 uppercase tracking-wider">
                Since First Flight
             </p>
          </div>
       </div>

       {/* Detailed Data Table */}
       <div className="bg-slate-900 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
         <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-fap-400" />
                <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Momentum & Wings</h3>
            </div>
            {pair.high24h && (
               <div className="text-[9px] text-slate-500 font-mono flex items-center gap-2">
                  <span>24H ROOF: {formatCurrency(pair.high24h)}</span>
               </div>
            )}
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-900/50 border-b border-slate-800">
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-500 font-bold tracking-wider">Timeframe</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-500 font-bold tracking-wider">Price Glide</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-500 font-bold tracking-wider">Volume (Seeds)</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-500 font-bold tracking-wider w-1/3">Buys vs Sells</th>
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