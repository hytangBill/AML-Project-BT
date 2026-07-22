import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { ProcessedTransaction } from '../types';
import { ShieldAlert, TrendingUp, Globe } from 'lucide-react';

interface ChartsSectionProps {
  alerts: ProcessedTransaction[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ alerts }) => {
  
  // 1. Risk Tier Breakdown
  const tierData = useMemo(() => {
    const counts = {
      'Low Risk': 0,
      'Medium Risk': 0,
      'High Risk': 0,
      'Critical Risk': 0
    };
    alerts.forEach(a => {
      counts[a.riskTier] = (counts[a.riskTier] || 0) + 1;
    });

    return [
      { name: 'Low Risk', count: counts['Low Risk'], color: '#64748b' },
      { name: 'Medium Risk', count: counts['Medium Risk'], color: '#f59e0b' },
      { name: 'High Risk', count: counts['High Risk'], color: '#ef4444' },
      { name: 'Critical Risk', count: counts['Critical Risk'], color: '#dc2626' }
    ];
  }, [alerts]);

  // 2. Time Trend Data
  const timeTrendData = useMemo(() => {
    const map = new Map<string, { date: string; totalAlerts: number; avgScore: number; sumScore: number }>();

    alerts.forEach(a => {
      const day = a.transactionDate.split('T')[0] || 'Unknown';
      if (!map.has(day)) {
        map.set(day, { date: day, totalAlerts: 0, avgScore: 0, sumScore: 0 });
      }
      const entry = map.get(day)!;
      entry.totalAlerts += 1;
      entry.sumScore += a.riskScore;
    });

    const list = Array.from(map.values()).map(e => ({
      ...e,
      avgScore: Math.round(e.sumScore / (e.totalAlerts || 1))
    }));

    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return list;
  }, [alerts]);

  // 3. Country Corridor Breakdown
  const countryData = useMemo(() => {
    const map = new Map<string, number>();

    alerts.forEach(a => {
      if (a.riskScore >= 30) {
        if (a.senderCountry) map.set(a.senderCountry, (map.get(a.senderCountry) || 0) + 1);
        if (a.receiverCountry) map.set(a.receiverCountry, (map.get(a.receiverCountry) || 0) + 1);
      }
    });

    const list = Array.from(map.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return list;
  }, [alerts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Chart 1: Time Trend Chart */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Alert Volume & Risk Score Trend Over Time
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Daily Temporal Pattern</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Line 
                type="monotone" 
                dataKey="totalAlerts" 
                name="Total Alerts" 
                stroke="#38bdf8" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#38bdf8' }} 
              />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                name="Avg Risk Score" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#f59e0b' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Risk Tier Distribution & Top Countries */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Risk Tier Distribution
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">By Tier</span>
          </div>

          <div className="h-40 w-full mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '11px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Flagged Countries */}
        <div className="border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2">
            <span className="flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" /> Top Flagged Country Corridors
            </span>
            <span>Alerts</span>
          </div>
          <div className="space-y-1">
            {countryData.length === 0 ? (
              <div className="text-[10px] text-slate-500 italic">No country risk matches</div>
            ) : (
              countryData.map(({ country, count }) => (
                <div key={country} className="flex items-center justify-between text-xs font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  <span className="text-slate-200 font-bold">{country}</span>
                  <span className="text-amber-400 font-bold">{count} txs</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
