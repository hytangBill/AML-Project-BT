import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  FileText, 
  User, 
  Building, 
  Globe, 
  Info, 
  Tag, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ProcessedTransaction, AnalystTag, JurisdictionThresholds } from '../types';
import { ADVISORY_DISCLAIMER, getDisplayCurrencyInfo, convertEurToDisplayAmount, formatMonetaryAmount } from '../utils/amlRules';

interface AlertDetailPanelProps {
  alert: ProcessedTransaction;
  thresholds: JurisdictionThresholds;
  onUpdateTag: (id: string, tag: AnalystTag, notes?: string) => void;
}

export const AlertDetailPanel: React.FC<AlertDetailPanelProps> = ({
  alert,
  thresholds,
  onUpdateTag
}) => {
  const [selectedTag, setSelectedTag] = useState<AnalystTag>(alert.analystTag);
  const [notes, setNotes] = useState<string>(alert.analystNotes || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveTag = (newTag: AnalystTag) => {
    setSelectedTag(newTag);
    onUpdateTag(alert.id, newTag, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveNotes = () => {
    onUpdateTag(alert.id, selectedTag, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Critical Risk':
        return 'bg-red-950/80 text-red-300 border-red-700/80 font-bold';
      case 'High Risk':
        return 'bg-red-900/40 text-red-400 border-red-800/60 font-semibold';
      case 'Medium Risk':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80 font-semibold';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700 font-medium';
    }
  };

  return (
    <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 text-slate-200 text-xs space-y-5">
      
      {/* Top Banner & Risk Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-mono flex items-center space-x-1.5 ${getTierBadge(alert.riskTier)}`}>
            <ShieldAlert className="w-4 h-4" />
            <span>{alert.riskTier} ({alert.riskScore}/100)</span>
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm">{alert.id} • {alert.transactionType}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Timestamp: {new Date(alert.transactionDate).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right font-mono">
          <div className="text-lg font-bold text-white">
            {alert.currency} {formatMonetaryAmount(alert.amount)}
          </div>
          {(() => {
            const ccyInfo = getDisplayCurrencyInfo(thresholds.jurisdictionCode);
            const displayAmount = convertEurToDisplayAmount(alert.amountInEur, thresholds.jurisdictionCode);
            if (alert.currency !== ccyInfo.code) {
              return (
                <div className="text-[11px] text-emerald-400 font-semibold">
                  ≈ {ccyInfo.shortLabel} {formatMonetaryAmount(displayAmount)}
                </div>
              );
            }
            return null;
          })()}
          <div className="text-[10px] text-slate-400">Account: {alert.accountNumber}</div>
        </div>
      </div>

      {/* Grid: Transaction Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3.5 rounded border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">Sender / Originator</span>
          <div className="font-semibold text-slate-200 flex items-center">
            <User className="w-3 h-3 mr-1 text-slate-400" /> {alert.sender}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Country: <strong className="text-slate-200">{alert.senderCountry}</strong></div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">Receiver / Beneficiary</span>
          <div className="font-semibold text-slate-200 flex items-center">
            <Building className="w-3 h-3 mr-1 text-slate-400" /> {alert.receiver}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Country: <strong className="text-slate-200">{alert.receiverCountry}</strong></div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">Customer / Entity Profile</span>
          <div className="font-semibold text-slate-200">{alert.customerType}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Channel: {alert.transactionType}</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono block mb-0.5">Geographic Corridor</span>
          <div className="font-mono text-slate-200 flex items-center">
            <Globe className="w-3 h-3 mr-1 text-blue-400" /> {alert.senderCountry} &rarr; {alert.receiverCountry}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Account ID: {alert.accountNumber}</div>
        </div>
      </div>

      {/* Itemized Trigger Reasons Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
            <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Itemized Risk Trigger Breakdown ({alert.triggerReasons.length} rules triggered)
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Weighted Rule Matrix</span>
        </div>

        {alert.triggerReasons.length === 0 ? (
          <div className="bg-slate-900 p-3 rounded text-slate-400 italic text-center">
            No risk rules triggered for this baseline transaction.
          </div>
        ) : (
          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-2">Rule Code</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Trigger Title & Description</th>
                  <th className="p-2 text-right">Severity</th>
                  <th className="p-2 text-right">Score Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950">
                {alert.triggerReasons.map((trg, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-2 font-mono text-blue-400 font-bold">{trg.code}</td>
                    <td className="p-2 font-mono text-slate-300">{trg.category}</td>
                    <td className="p-2">
                      <div className="font-semibold text-slate-200">{trg.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{trg.description}</div>
                    </td>
                    <td className="p-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trg.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                        trg.severity === 'High' ? 'bg-red-900/40 text-red-400 border border-red-800/50' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {trg.severity}
                      </span>
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-amber-400">+{trg.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Narrative & Regulatory Next Step Recommendation */}
      {(alert.riskScore >= 60 || alert.narrativeSummary) && (
        <div className="bg-blue-950/30 border border-blue-900/60 p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-2 text-blue-300 font-bold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Compliance Narrative & Regulatory Action Recommendation</span>
          </div>

          <p className="text-slate-200 leading-relaxed text-xs">
            {alert.narrativeSummary}
          </p>

          <div className="bg-slate-900 border border-slate-700/80 p-3 rounded text-amber-200 font-mono text-[11px]">
            <strong className="text-amber-400 block mb-1">RECOMMENDED REGULATORY NEXT STEP:</strong>
            {alert.recommendedAction || thresholds.sarDirective}
          </div>

          {/* Mandatory Disclaimer Box */}
          <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded text-[11px] text-slate-300 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{ADVISORY_DISCLAIMER}</span>
          </div>
        </div>
      )}

      {/* Analyst Tagging & Audit Trail Notes */}
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-slate-200">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Analyst Determination Tag</span>
          </div>
          {savedSuccess && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Determination Recorded to Audit Trail
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSaveTag('Confirmed Suspicious')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
              selectedTag === 'Confirmed Suspicious'
                ? 'bg-red-600 text-white border-red-500 shadow-md ring-2 ring-red-400/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-red-950 hover:text-red-300'
            }`}
          >
            Confirmed Suspicious (Escalate SAR)
          </button>

          <button
            onClick={() => handleSaveTag('Requires Continued Monitoring')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
              selectedTag === 'Requires Continued Monitoring'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-amber-950 hover:text-amber-300'
            }`}
          >
            Requires Continued Monitoring
          </button>

          <button
            onClick={() => handleSaveTag('Determined False Positive')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
              selectedTag === 'Determined False Positive'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-emerald-950 hover:text-emerald-300'
            }`}
          >
            Determined False Positive
          </button>

          <button
            onClick={() => handleSaveTag('Unreviewed')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
              selectedTag === 'Unreviewed'
                ? 'bg-slate-700 text-slate-100 border-slate-600'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            Reset to Unreviewed
          </button>
        </div>

        {/* Audit Note Textarea */}
        <div className="pt-2">
          <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center">
            <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Analyst Audit Justification Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 text-xs focus:border-blue-500 outline-none resize-none"
            placeholder="Type analyst justification narrative, EDD findings, or escalation notes..."
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSaveNotes}
              className="px-3.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 rounded text-xs font-medium transition-colors"
            >
              Save Audit Note
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
