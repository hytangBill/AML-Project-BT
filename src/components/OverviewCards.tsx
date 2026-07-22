import React from 'react';
import { AlertTriangle, DollarSign, Activity, ShieldAlert } from 'lucide-react';
import { DatasetStats, ProcessedTransaction, ThresholdVersionInfo } from '../types';

interface OverviewCardsProps {
  stats: DatasetStats;
  alerts: ProcessedTransaction[];
  versionInfo: ThresholdVersionInfo;
  jurisdictionName: string;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  stats,
  alerts,
  versionInfo,
  jurisdictionName
}) => {
  const criticalCount = alerts.filter(a => a.riskTier === 'Critical Risk').length;
  const highCount = alerts.filter(a => a.riskTier === 'High Risk').length;
  const mediumCount = alerts.filter(a => a.riskTier === 'Medium Risk').length;
  const totalAlertsCount = criticalCount + highCount + mediumCount;

  // Primary currency
  const mainCcy = Object.keys(stats.currencyMap)[0] || 'USD';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Volume */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Volume Analyzed</span>
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold font-mono text-slate-100">
            {mainCcy} {stats.totalVolume.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {stats.uniqueAccountsCount} unique account entities
          </div>
        </div>
      </div>

      {/* 2. Total Records */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Transactions</span>
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold font-mono text-slate-100">
            {stats.totalTransactions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Date range: {stats.dateStart} to {stats.dateEnd}
          </div>
        </div>
      </div>

      {/* 3. Total Risk Alerts */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Flagged Risk Alerts</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {totalAlertsCount}
            </span>
            <span className="text-xs text-slate-400">
              ({((totalAlertsCount / Math.max(1, stats.totalTransactions)) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
            <span className="text-amber-400 font-semibold">{mediumCount} Med</span>
            <span>•</span>
            <span className="text-red-400 font-semibold">{highCount} High</span>
            <span>•</span>
            <span className="text-red-500 font-bold">{criticalCount} Critical</span>
          </div>
        </div>
      </div>

      {/* 4. Critical Escalations */}
      <div className="bg-slate-900 border border-red-900/40 p-4 rounded-xl flex flex-col justify-between shadow-sm bg-gradient-to-br from-slate-900 to-red-950/20">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-300">Critical SAR Escalations</span>
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold font-mono text-red-400">
            {criticalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Active Rule Version: <strong className="text-amber-300 font-mono">v{versionInfo.versionNumber}</strong> ({jurisdictionName})
          </div>
        </div>
      </div>

    </div>
  );
};
