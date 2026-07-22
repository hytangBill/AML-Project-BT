import React, { useState } from 'react';
import { Download, X, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import Papa from 'papaparse';
import { ProcessedTransaction, JurisdictionThresholds, ThresholdVersionInfo } from '../types';
import { ADVISORY_DISCLAIMER } from '../utils/amlRules';

interface AuditExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ProcessedTransaction[];
  thresholds: JurisdictionThresholds;
  versionInfo: ThresholdVersionInfo;
  datasetName: string;
}

export const AuditExportModal: React.FC<AuditExportModalProps> = ({
  isOpen,
  onClose,
  alerts,
  thresholds,
  versionInfo,
  datasetName
}) => {
  const [exported, setExported] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const nowIso = new Date().toISOString();

    // 1. Audit Metadata Header Block
    const metadataLines = [
      ['AML RISK ANALYSIS COMPLIANCE AUDIT RECORD'],
      ['Generated Timestamp (UTC)', nowIso],
      ['Dataset Reference', datasetName],
      ['Regulatory Jurisdiction Framework', `${thresholds.name} (${thresholds.jurisdictionCode})`],
      ['Active Threshold Rule Version', `v${versionInfo.versionNumber} (${versionInfo.updatedAt})`],
      ['Cash Reporting Threshold', `${thresholds.currency} ${thresholds.cashThreshold}`],
      ['Structuring Limit / Days Window', `${thresholds.currency} ${thresholds.structuringAmount} / ${thresholds.structuringWindowDays} Days`],
      ['Layering Window / Min Txs', `${thresholds.layeringWindowHours} Hours / ${thresholds.layeringMinCount} Txs`],
      ['High-Risk Jurisdiction Countries', thresholds.highRiskCountries.join('; ')],
      ['PEP Screening Enabled', thresholds.pepScreening ? 'YES' : 'NO'],
      ['Sanctions Screening Enabled', thresholds.sanctionsScreening ? 'YES' : 'NO'],
      ['Total Records in Dataset', alerts.length],
      ['Critical Escalations Count', alerts.filter(a => a.riskTier === 'Critical Risk').length],
      ['Legal Disclaimer', ADVISORY_DISCLAIMER],
      [] // Blank separator line
    ];

    // 2. Data Rows
    const dataRows = alerts.map((item) => ({
      'Transaction ID': item.id,
      'Transaction Date': item.transactionDate,
      'Risk Score': item.riskScore,
      'Risk Tier': item.riskTier,
      'Amount (Original)': item.amount,
      'Currency': item.currency,
      'Amount (EUR Equivalent)': item.amountInEur.toFixed(2),
      'Primary Account Under Review': item.primaryAccount,
      'Sender Name': item.sender,
      'Sender Country': item.senderCountry,
      'Receiver Name': item.receiver,
      'Receiver Country': item.receiverCountry,
      'Sender Account Number': item.accountNumber,
      'Transaction Type': item.transactionType,
      'Customer Type': item.customerType,
      'Trigger Rules': item.triggerReasons.map(t => `${t.code}:${t.title}`).join(' | '),
      'Analyst Status Tag': item.analystTag,
      'Analyst Notes': item.analystNotes || '',
      'Recommended Action': item.recommendedAction || ''
    }));

    const metadataCsv = Papa.unparse(metadataLines);
    const dataCsv = Papa.unparse(dataRows);
    const fullCsv = `${metadataCsv}\n\n${dataCsv}`;

    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AML_Audit_Report_${thresholds.jurisdictionCode}_v${versionInfo.versionNumber}_${nowIso.split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-lg w-full text-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-base text-slate-100">Export Compliance Audit Record</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-slate-200 text-sm flex items-center justify-between">
              <span>Audit Snapshot Summary</span>
              <span className="text-amber-400 font-mono text-xs">v{versionInfo.versionNumber}</span>
            </div>
            
            <div className="text-slate-400 space-y-1 font-mono text-[11px]">
              <div>• Framework: <strong className="text-slate-200">{thresholds.name}</strong></div>
              <div>• Dataset: <strong className="text-slate-200">{datasetName}</strong> ({alerts.length} records)</div>
              <div>• Cash Threshold: <strong className="text-slate-200">{thresholds.currency} {thresholds.cashThreshold.toLocaleString()}</strong></div>
              <div>• Active Version ID: <strong className="text-slate-200">{versionInfo.versionId}</strong></div>
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-900/60 p-3 rounded text-[11px] text-blue-200 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>The exported CSV includes an embedded regulatory header block detailing active threshold parameters, time of export, rule version, risk trigger breakdowns, and analyst determinations for official audit retention.</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[10px] text-slate-400 italic">
            "{ADVISORY_DISCLAIMER}"
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDownloadCSV}
            disabled={exported}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs flex items-center space-x-1.5 shadow-sm transition-colors disabled:opacity-50"
          >
            {exported ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>CSV Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Audit CSV</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
