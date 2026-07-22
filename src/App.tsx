import React, { useState, useMemo, useEffect } from 'react';
import { 
  JurisdictionType, 
  JurisdictionThresholds, 
  ThresholdVersionInfo, 
  RawTransactionRecord, 
  ColumnMapping, 
  AnalystTag 
} from './types';
import { JURISDICTION_PRESETS, analyzeTransactions, ADVISORY_DISCLAIMER } from './utils/amlRules';
import { SAMPLE_DATASETS } from './utils/sampleData';
import { Header } from './components/Header';
import { OverviewCards } from './components/OverviewCards';
import { ChartsSection } from './components/ChartsSection';
import { RiskTable } from './components/RiskTable';
import { DataUploadModal } from './components/DataUploadModal';
import { ThresholdSettingsPanel } from './components/ThresholdSettingsPanel';
import { AuditExportModal } from './components/AuditExportModal';
import { ShieldCheck, Info, Upload, Sliders, Database } from 'lucide-react';

export default function App() {
  // State
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>('EU');
  const [thresholds, setThresholds] = useState<JurisdictionThresholds>(JURISDICTION_PRESETS.EU);
  const [versionInfo, setVersionInfo] = useState<ThresholdVersionInfo>({
    versionId: 'ver-1-initial',
    versionNumber: 1,
    updatedAt: new Date().toISOString(),
    jurisdiction: 'EU'
  });

  const [datasetName, setDatasetName] = useState<string>('Structuring & Smurfing Syndicate Dataset');
  const [rawRecords, setRawRecords] = useState<RawTransactionRecord[]>(SAMPLE_DATASETS[0].data);
  const [mapping, setMapping] = useState<ColumnMapping>({
    transactionDate: 'transaction_date',
    amount: 'amount',
    currency: 'currency',
    sender: 'sender',
    receiver: 'receiver',
    senderCountry: 'sender_country',
    receiverCountry: 'receiver_country',
    accountNumber: 'account_number',
    transactionType: 'transaction_type',
    customerType: 'customer_type'
  });

  // Modal Visibility
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Analysts Tags State override map
  const [analystOverrides, setAnalystOverrides] = useState<Record<string, { tag: AnalystTag; notes?: string }>>({});

  // Perform Analysis using active rules & thresholds
  const analysisResult = useMemo(() => {
    const result = analyzeTransactions(rawRecords, mapping, thresholds);
    
    // Apply any analyst tags or notes overrides stored in state
    const updatedProcessed = result.processed.map(item => {
      if (analystOverrides[item.id]) {
        return {
          ...item,
          analystTag: analystOverrides[item.id].tag,
          analystNotes: analystOverrides[item.id].notes ?? item.analystNotes
        };
      }
      return item;
    });

    return {
      processed: updatedProcessed,
      stats: result.stats
    };
  }, [rawRecords, mapping, thresholds, analystOverrides]);

  // Handlers
  const handleDataLoaded = (newRecords: RawTransactionRecord[], newMapping: ColumnMapping, name: string) => {
    setRawRecords(newRecords);
    setMapping(newMapping);
    setDatasetName(name);
    setAnalystOverrides({}); // reset tags for new dataset
  };

  const handleUpdateThresholds = (
    newJur: JurisdictionType,
    newThresholds: JurisdictionThresholds,
    newVersion: ThresholdVersionInfo
  ) => {
    setJurisdiction(newJur);
    setThresholds(newThresholds);
    setVersionInfo(newVersion);
  };

  const handleUpdateTag = (id: string, tag: AnalystTag, notes?: string) => {
    setAnalystOverrides(prev => ({
      ...prev,
      [id]: { tag, notes }
    }));
  };

  const handleQuickLoadSample = () => {
    const nextSample = datasetName.includes('Structuring') ? SAMPLE_DATASETS[1] : SAMPLE_DATASETS[0];
    setRawRecords(nextSample.data);
    setDatasetName(nextSample.name);
    setAnalystOverrides({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header Bar */}
      <Header
        jurisdiction={jurisdiction}
        jurisdictionName={thresholds.name}
        versionInfo={versionInfo}
        totalRecords={analysisResult.processed.length}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportAudit={() => setIsExportOpen(true)}
        onLoadSample={handleQuickLoadSample}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Permanent Regulatory Disclaimer Banner */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-start space-x-3 text-xs text-slate-400 shadow-sm">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[10px] block mb-0.5">
              Decision Support Notice & Compliance Advisory
            </span>
            <span>
              This application provides automated risk scoring and decision support for Anti-Money Laundering (AML) compliance analysts. <strong>{ADVISORY_DISCLAIMER}</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Trail Active (v{versionInfo.versionNumber})</span>
          </div>
        </div>

        {/* Dataset Header Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                Active Dataset
              </span>
              <h2 className="text-base font-bold text-slate-100">{datasetName}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Screened against <strong className="text-slate-200">{thresholds.name}</strong> thresholds • {analysisResult.processed.length} Transactions
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium inline-flex items-center space-x-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Change File / Dataset</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium inline-flex items-center space-x-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure Rules</span>
            </button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <OverviewCards
          stats={analysisResult.stats}
          alerts={analysisResult.processed}
          versionInfo={versionInfo}
          jurisdictionName={thresholds.name}
        />

        {/* Analytical Charts */}
        <ChartsSection alerts={analysisResult.processed} />

        {/* Risk Ranking Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Suspicious Transaction Risk Ranking
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Click any row to inspect itemized trigger reasons and AI narrative
            </span>
          </div>

          <RiskTable
            alerts={analysisResult.processed}
            thresholds={thresholds}
            onUpdateTag={handleUpdateTag}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            AML Risk Analysis Dashboard • Professional Compliance Decision Support
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            Active Framework: {thresholds.name} • Version v{versionInfo.versionNumber}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DataUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
      />

      <ThresholdSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentJurisdiction={jurisdiction}
        currentThresholds={thresholds}
        versionInfo={versionInfo}
        onUpdateThresholds={handleUpdateThresholds}
      />

      <AuditExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        alerts={analysisResult.processed}
        thresholds={thresholds}
        versionInfo={versionInfo}
        datasetName={datasetName}
      />

    </div>
  );
}
