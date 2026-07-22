import React from 'react';
import { ShieldAlert, FileSpreadsheet, Settings, Download, Database, Layers } from 'lucide-react';
import { JurisdictionType, ThresholdVersionInfo } from '../types';

interface HeaderProps {
  jurisdiction: JurisdictionType;
  jurisdictionName: string;
  versionInfo: ThresholdVersionInfo;
  totalRecords: number;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onExportAudit: () => void;
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  jurisdiction,
  jurisdictionName,
  versionInfo,
  totalRecords,
  onOpenUpload,
  onOpenSettings,
  onExportAudit,
  onLoadSample
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-3.5 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">AML Risk Analysis Dashboard</h1>
              <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-full font-semibold">
                Compliance AI
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center text-slate-300 font-medium">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {jurisdictionName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-400">
                Rule Version: <strong className="text-slate-200">v{versionInfo.versionNumber}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                Active Records: <strong className="text-blue-400">{totalRecords}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={onLoadSample}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Load built-in AML test datasets"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Dataset</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Thresholds & Rules</span>
          </button>

          <button
            onClick={onExportAudit}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>

      </div>
    </header>
  );
};
