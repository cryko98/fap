import React from 'react';
import { DexPair } from '../types';
import { DollarSign, BarChart3, Users, Droplets, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

interface StatsGridProps {
  pair: DexPair;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; trend?: number; delay: number }> = ({ label, value, icon, trend, delay }) => (
  <div 
    className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group opacity-0 animate-slide-up relative overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-start mb-2">
      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-600 group-hover:bg-fap-50 group-hover:text-fap-600 transition-colors">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5 border rounded ${trend >= 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {trend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xl font-black text-slate-900 font-mono tracking-tight">{value}</p>
    </div>
  </div>
);

export const StatsGrid: React.FC<StatsGridProps> = ({ pair }) => {
  const mcap = pair.marketCap || pair.fdv;
  
  return (
    <div className="w-full flex flex-col">
       <div className="flex items-center gap-2 mb-3">
         <div className="p-1 bg-slate-50 border border-slate-200 rounded shadow-sm">
           <Zap size={14} className="text-fap-600" />
         </div>
         <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Live Market Data</h3>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard 
          label="PRICE (USD)" 
          value={`$${pair.priceUsd}`} 
          icon={<DollarSign size={16} />} 
          trend={pair.priceChange.h24}
          delay={0}
        />
        <StatCard 
          label="MARKET CAP" 
          value={formatCurrency(mcap)} 
          icon={<Users size={16} />} 
          delay={100}
        />
        <StatCard 
          label="LIQUIDITY" 
          value={formatCurrency(pair.liquidity.usd)} 
          icon={<Droplets size={16} />} 
          delay={200}
        />
        <StatCard 
          label="24H VOLUME" 
          value={formatCurrency(pair.volume.h24)} 
          icon={<Activity size={16} />} 
          delay={300}
        />
      </div>
    </div>
  );
};