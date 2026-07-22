import React from 'react';
import { X, ShieldCheck, Info, BookOpen, AlertTriangle, Scale, Layers, HelpCircle } from 'lucide-react';
import { ADVISORY_DISCLAIMER } from '../utils/amlRules';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">About & Methodology Guide</h2>
              <p className="text-xs text-slate-400">AML Risk Scoring Engine & Decision Support Architecture</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-slate-300">
          
          {/* Executive Summary */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Purpose & Overview</span>
            </div>
            <p>
              The <strong>AML Risk Analysis Dashboard</strong> is an interactive compliance intelligence prototype designed to assist financial crime analysts in identifying, scoring, and prioritizing suspicious transaction patterns. It normalizes multi-currency data, applies configurable statutory thresholds, and screens transactions against key Anti-Money Laundering (AML) typologies.
            </p>
          </div>

          {/* Core Scoring Methodology */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Core Risk Typologies & Scoring Rules</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-amber-400">1. Currency Normalization</div>
                <p className="text-slate-400 text-[11px]">
                  All foreign amounts (USD, GBP, JPY, CHF, RUB) are normalized into EUR equivalents before threshold evaluation using standardized reference conversion rates.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-blue-400">2. Statutory Amount Rules (AML-AMT-01 & 02)</div>
                <p className="text-slate-400 text-[11px]">
                  Flags transactions meeting or exceeding the jurisdiction threshold (e.g. EUR 10,000) or standalone payments falling in the near-threshold band (90%–99%).
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-purple-400">3. Multi-Transaction Structuring (AML-STR-01)</div>
                <p className="text-slate-400 text-[11px]">
                  Detects multiple sub-threshold transactions from the same sender to the <em>same recipient</em> within a rolling time window. Score scales directly with aggregate volume ratio.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-cyan-400">4. Dispersed Distribution (AML-LAY-02)</div>
                <p className="text-slate-400 text-[11px]">
                  Triggers when transactions from a single sender go to <em>multiple distinct recipients</em>. Capped at Medium Risk on its own to prevent false positive inflation.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-rose-400">5. Geographic & Sanctions Risk (AML-GEO & SNC)</div>
                <p className="text-slate-400 text-[11px]">
                  Evaluates high-risk origin/destination country corridors (IR, KP, SY, RU, BY, KY, PA) and screens customer entity types for PEP and sanctions matches.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-emerald-400">6. Composite Risk Tiers</div>
                <p className="text-slate-400 text-[11px]">
                  Combines scores into four tiers: <strong>Low</strong> (&lt;25), <strong>Medium</strong> (25–49), <strong>High</strong> (50–74), and <strong>Critical</strong> (&ge;75).
                </p>
              </div>
            </div>
          </div>

          {/* Academic & Decision Support Notice */}
          <div className="bg-amber-950/30 border border-amber-800/60 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Scale className="w-4 h-4" />
              <span>Decision Support & Compliance Notice</span>
            </div>
            <p className="text-slate-300">
              This application is a decision-support prototype developed as part of a financial technology project. <strong>{ADVISORY_DISCLAIMER}</strong> Automated risk scores do not constitute formal regulatory filings or legal determination of financial crime.
            </p>
          </div>

          {/* Known Limitations */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-200 font-bold uppercase tracking-wider text-xs">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              <span>Known Prototype Limitations</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <strong className="text-slate-300">Watchlist Screening:</strong> Sanctions and PEP matching rely on synthetic keyword patterns rather than direct live integration with OFAC, EU, or UN sanctions list APIs.
              </li>
              <li>
                <strong className="text-slate-300">Foreign Exchange Rates:</strong> Currency conversion uses static reference rates rather than real-time intraday spot market feeds.
              </li>
              <li>
                <strong className="text-slate-300">Analytical Scope:</strong> Detection rules are illustrative of key typologies and do not encompass every complex multi-tiered laundering scheme.
              </li>
            </ul>
          </div>

          {/* Demo Data Disclaimer */}
          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3 flex items-center justify-between">
            <span>Demo datasets contain strictly synthetic data for testing purposes.</span>
            <span className="font-mono text-slate-400">Version 1.2 • Published Build</span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
