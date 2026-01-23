import React from 'react';
import { DexPair } from '../types';
import { DollarSign, Users, Droplets, TrendingUp, TrendingDown, Clock, BarChart2, Hash, ArrowUpRight } from 'lucide-react';

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
    if (p < 0.000001) return price; // Scientific notation or very small
    return `$${p.toFixed(8)}`;
};

const TimeframeRow = ({ label, change, vol, buys, sells }: { label: string, change: number, vol: number, buys: number, sells: number }) => {
  const isPositive = change >= 0;
  const total = buys + sells;
  const buyPercentage = total > 0 ? (buys / total) * 100 : 0;
  const sellPercentage = total > 0 ? (sells / total) * 100 : 0;
  
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4 font-mono text-xs font-bold text-slate-500">{label}</td>
      <td className={`py-3 px-4 font-mono text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <div className="flex items-center gap-1">
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </td>
      <td className="py-3 px-4 font-mono text-xs text-slate-700">{formatCurrency(vol)}</td>
      <td className="py-3 px-4 min-w-[160px]">
        <div className="flex flex-col gap-1.5 w-full">
           <div className="flex justify-between text-[10px] font-mono font-medium">
             <span className="text-green-600 flex items-center gap-1">
                {buys} 
                <span className="text-[9px] opacity-70 bg-green-50 px-1 rounded tracking-tight">{(buyPercentage).toFixed(0)}%</span>
             </span>
             <span className="text-red-600 flex items-center gap-1">
                <span className="text-[9px] opacity-70 bg-red-50 px-1 rounded tracking-tight">{(sellPercentage).toFixed(0)}%</span>
                {sells}
             </span>
           </div>
           
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex relative shadow-inner">
             {/* Buy Bar (Green Gradient) */}
             <div 
               className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out" 
               style={{ width: `${buyPercentage}%` }}
             ></div>
             
             {/* Sell Bar (Red Gradient) */}
             <div 
               className="h-full bg-gradient-to-l from-red-500 to-red-400 transition-all duration-500 ease-out" 
               style={{ width: `${sellPercentage}%` }}
             ></div>
             
             {/* Middle separator line marker for visual balance */}
             <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/40 z-10 mix-blend-overlay"></div>
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
       
       {/* Top Metrics Row */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <DollarSign size={48} />
             </div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Price USD</p>
             <p className="text-xl md:text-2xl font-mono font-black tracking-tight">{formatPrice(pair.priceUsd)}</p>
             <div className="flex items-center gap-1 mt-1">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${dropFromHigh < -20 ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                    High: {formatCurrency(high24h)}
                </span>
             </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center gap-2 mb-1 text-slate-400">
               <Users size={14} />
               <p className="text-xs font-bold uppercase tracking-widest">Market Cap</p>
             </div>
             <p className="text-xl font-mono font-black text-slate-800">{formatCurrency(mcap)}</p>
             <p className="text-[10px] text-slate-400 font-mono mt-1">
                FDV: {formatCurrency(pair.fdv)}
             </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center gap-2 mb-1 text-slate-400">
               <Droplets size={14} />
               <p className="text-xs font-bold uppercase tracking-widest">Liquidity</p>
             </div>
             <p className="text-xl font-mono font-black text-slate-800">{formatCurrency(pair.liquidity.usd)}</p>
             <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Ratio: <span className={liqRatio < 5 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{liqRatio.toFixed(1)}%</span> of MC
             </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center gap-2 mb-1 text-slate-400">
               <Clock size={14} />
               <p className="text-xs font-bold uppercase tracking-widest">Token Age</p>
             </div>
             <p className="text-sm font-mono font-bold text-slate-800">
                {new Date(pair.pairCreatedAt).toLocaleDateString()}
             </p>
             <p className="text-[10px] text-slate-400 font-mono">
                {new Date(pair.pairCreatedAt).toLocaleTimeString()}
             </p>
          </div>
       </div>

       {/* Detailed Data Table */}
       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-fap-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Volume & Momentum</h3>
            </div>
            {pair.high24h && (
               <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                  <span>ATH(24h): {formatCurrency(pair.high24h)}</span>
                  <span className={dropFromHigh < -50 ? 'text-red-500 font-bold' : 'text-slate-500'}>
                     ({dropFromHigh.toFixed(1)}%)
                  </span>
               </div>
            )}
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-white border-b border-slate-100">
                 <th className="py-2 px-4 text-[10px] uppercase text-slate-400 font-bold tracking-wider">Timeframe</th>
                 <th className="py-2 px-4 text-[10px] uppercase text-slate-400 font-bold tracking-wider">Price Chg</th>
                 <th className="py-2 px-4 text-[10px] uppercase text-slate-400 font-bold tracking-wider">Volume</th>
                 <th className="py-2 px-4 text-[10px] uppercase text-slate-400 font-bold tracking-wider w-1/3">Buys / Sells (Pressure)</th>
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