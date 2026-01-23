import React from 'react';
import { DexPair } from '../types';
import { DollarSign, Users, Droplets, TrendingUp, TrendingDown, Clock, BarChart2, Snowflake, Fish, ThermometerSnowflake, MountainSnow } from 'lucide-react';

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
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
      <td className="py-3 px-4 font-mono text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</td>
      <td className={`py-3 px-4 font-mono text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <div className="flex items-center gap-1">
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change).toFixed(2)}%
        </div>
      </td>
      <td className="py-3 px-4 font-mono text-xs text-slate-600">{formatCurrency(vol)}</td>
      <td className="py-3 px-4 min-w-[140px]">
        <div className="flex flex-col gap-1.5 w-full">
           <div className="flex justify-between text-[9px] font-mono font-medium text-slate-500">
             <span className="text-green-600 flex items-center gap-1">B: {buys}</span>
             <span className="text-red-600 flex items-center gap-1">S: {sells}</span>
           </div>
           
           <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex relative">
             <div className="h-full bg-green-500" style={{ width: `${buyPercentage}%` }}></div>
             <div className="h-full bg-red-500" style={{ width: `${sellPercentage}%` }}></div>
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
       
       {/* Top Metrics Row - Light Tech Cards */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Price Card */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-green-400 transition-all hover:shadow-md">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-transform text-slate-900">
               <DollarSign size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Fish size={14} className="text-fap-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Current Fish-Price</p>
             </div>
             <p className="text-xl md:text-2xl font-mono font-black tracking-tight text-slate-900">
                {formatPrice(pair.priceUsd)}
             </p>
             <div className="flex items-center gap-1 mt-2">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${dropFromHigh < -20 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
                    Slide from Top: {dropFromHigh.toFixed(1)}%
                </span>
             </div>
          </div>

          {/* Market Cap Card */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all hover:shadow-md">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-transform text-slate-900">
               <Users size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
               <Users size={14} className="text-blue-500" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Market Penguin</p>
             </div>
             <p className="text-xl font-mono font-black text-slate-900">{formatCurrency(mcap)}</p>
             <p className="text-[9px] text-slate-400 font-mono mt-1">
                Fully Diluted Flippers: {formatCurrency(pair.fdv)}
             </p>
          </div>

          {/* Liquidity Card */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-cyan-400 transition-all hover:shadow-md">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-transform text-slate-900">
               <MountainSnow size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
               <Droplets size={14} className="text-cyan-500" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Iceberg Depth</p>
             </div>
             <p className="text-xl font-mono font-black text-slate-900">{formatCurrency(pair.liquidity.usd)}</p>
             <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                    className={`h-full ${liqRatio < 5 ? 'bg-red-500' : 'bg-cyan-500'} shadow-sm`} 
                    style={{width: `${Math.min(liqRatio * 2, 100)}%`}}
                ></div>
             </div>
             <p className="text-[9px] text-slate-400 mt-1 font-mono text-right">
                Frozen: {liqRatio.toFixed(1)}%
             </p>
          </div>

          {/* Age Card */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all hover:shadow-md">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-transform text-slate-900">
               <Clock size={64} />
             </div>
             <div className="flex items-center gap-2 mb-2 text-slate-500">
               <ThermometerSnowflake size={14} className="text-amber-500" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Ice Age</p>
             </div>
             <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                {new Date(pair.pairCreatedAt).toLocaleDateString()}
             </p>
             <p className="text-[9px] text-amber-600/80 font-mono mt-1 uppercase tracking-wider">
                Since First Snow
             </p>
          </div>
       </div>

       {/* Detailed Data Table */}
       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-fap-600" />
                <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Momentum & Flippers</h3>
            </div>
            {pair.high24h && (
               <div className="text-[9px] text-slate-500 font-mono flex items-center gap-2">
                  <span>24H PEAK: {formatCurrency(pair.high24h)}</span>
               </div>
            )}
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-white border-b border-slate-100">
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-400 font-bold tracking-wider">Timeframe</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-400 font-bold tracking-wider">Price Slide</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-400 font-bold tracking-wider">Volume (Sardines)</th>
                 <th className="py-2 px-4 text-[9px] uppercase text-slate-400 font-bold tracking-wider w-1/3">Buys vs Sells</th>
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