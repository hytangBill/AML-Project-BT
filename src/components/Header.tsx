import React from 'react';
import { ShieldAlert, FileSpreadsheet, Settings, Download, Database, Layers, BookOpen, ChevronDown } from 'lucide-react';
import { JurisdictionType, ThresholdVersionInfo } from '../types';
import { SAMPLE_DATASETS } from '../utils/sampleData';

interface HeaderProps {
  jurisdiction: JurisdictionType;
  jurisdictionName: string;
  versionInfo: ThresholdVersionInfo;
  totalRecords: number;
  activeDatasetName: string;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onExportAudit: () => void;
  onOpenMethodology: () => void;
  onSelectSampleDataset: (sampleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  jurisdiction,
  jurisdictionName,
  versionInfo,
  totalRecords,
  activeDatasetName,
  onOpenUpload,
  onOpenSettings,
  onExportAudit,
  onOpenMethodology,
  onSelectSampleDataset
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-3.5 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Branding & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">AML Risk Analysis Dashboard</h1>
              <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-full font-semibold">
                Decision Support
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5 flex-wrap">
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

        {/* Right: Actions & Demo Selector */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          
          {/* Demo Datasets Dropdown Menu */}
          <div className="relative group">
            <button
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/80 rounded text-xs font-semibold transition-colors shadow-sm"
              title="Try a preloaded demonstration dataset"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Try a Demo</span>
              <ChevronDown className="w-3 h-3 text-blue-400" />
            </button>

            <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50 p-2 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2.5 py-1">
                Preloaded Demo Datasets
              </div>
              {SAMPLE_DATASETS.map((sample) => {
                const isActive = activeDatasetName === sample.name;
                return (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSampleDataset(sample.id)}
                    className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors block ${
                      isActive 
                        ? 'bg-blue-900/40 text-blue-200 font-semibold border border-blue-800' 
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-100 flex items-center justify-between">
                      <span>{sample.name}</span>
                      {isActive && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono">Active</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                      {sample.description}
                    </div>
                  </button>
                );
              })}
              <div className="text-[9px] text-slate-500 italic px-2.5 pt-1.5 border-t border-slate-800">
                Sample data for demonstration — not real financial data.
              </div>
            </div>
          </div>

          {/* About & Methodology */}
          <button
            onClick={onOpenMethodology}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Read dashboard scoring methodology and disclosures"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>About & Methodology</span>
          </button>

          {/* Import CSV */}
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import File</span>
          </button>

          {/* Configure Rules */}
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Thresholds</span>
          </button>

          {/* Export Audit CSV */}
          <button
            onClick={onExportAudit}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>
    </header>
  );
};

