import React, { useState } from 'react';
import { Sliders, RefreshCw, Layers, ShieldCheck, Clock, Globe, HelpCircle, Save } from 'lucide-react';
import { JurisdictionType, JurisdictionThresholds, ThresholdVersionInfo } from '../types';
import { JURISDICTION_PRESETS } from '../utils/amlRules';

interface ThresholdSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentJurisdiction: JurisdictionType;
  currentThresholds: JurisdictionThresholds;
  versionInfo: ThresholdVersionInfo;
  onUpdateThresholds: (
    jurisdiction: JurisdictionType,
    thresholds: JurisdictionThresholds,
    newVersion: ThresholdVersionInfo
  ) => void;
}

export const ThresholdSettingsPanel: React.FC<ThresholdSettingsPanelProps> = ({
  isOpen,
  onClose,
  currentJurisdiction,
  currentThresholds,
  versionInfo,
  onUpdateThresholds
}) => {
  const [selectedJur, setSelectedJur] = useState<JurisdictionType>(currentJurisdiction);
  const [formValues, setFormValues] = useState<JurisdictionThresholds>({ ...currentThresholds });
  const [countryInput, setCountryInput] = useState<string>(currentThresholds.highRiskCountries.join(', '));

  if (!isOpen) return null;

  const handleJurisdictionChange = (jur: JurisdictionType) => {
    setSelectedJur(jur);
    const preset = JURISDICTION_PRESETS[jur];
    setFormValues({ ...preset });
    setCountryInput(preset.highRiskCountries.join(', '));
  };

  const handleApply = () => {
    const parsedCountries = countryInput
      .split(',')
      .map(c => c.trim().toUpperCase())
      .filter(Boolean);

    const updatedThresholds: JurisdictionThresholds = {
      ...formValues,
      highRiskCountries: parsedCountries
    };

    const nextVersionNum = versionInfo.versionNumber + 1;
    const nowIso = new Date().toISOString();

    const newVersion: ThresholdVersionInfo = {
      versionId: `ver-${nextVersionNum}-${Date.now()}`,
      versionNumber: nextVersionNum,
      updatedAt: nowIso,
      jurisdiction: selectedJur
    };

    onUpdateThresholds(selectedJur, updatedThresholds, newVersion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-slate-100">Jurisdiction & Regulatory Detection Thresholds</h2>
          </div>
          <div className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
            Active Version: <strong className="text-amber-400">v{versionInfo.versionNumber}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Jurisdiction Dropdown */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <label className="text-xs font-semibold text-slate-200 block mb-1.5 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              <span>Select Regulatory Jurisdiction Framework</span>
            </label>
            <select
              value={selectedJur}
              onChange={(e) => handleJurisdictionChange(e.target.value as JurisdictionType)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-md p-2 focus:border-blue-500 outline-none font-medium"
            >
              <option value="EU">European Union (AMLR / AMLD6 Article 35 Directive)</option>
              <option value="US">United States (BSA / FinCEN CTR & SAR Rules)</option>
              <option value="CUSTOM">Custom Enterprise / Internal Compliance Policy</option>
            </select>
            <div className="text-[11px] text-slate-400 mt-2 bg-slate-900/60 p-2 rounded border border-slate-800/80">
              <strong>Regulatory SAR Guidance:</strong> {formValues.sarDirective}
            </div>
          </div>

          {/* Configurable Threshold Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Cash Threshold */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block flex items-center justify-between">
                <span>Cash Reporting Threshold ({formValues.currency})</span>
                <HelpCircle className="w-3 h-3 text-slate-500" title="Transactions equal or above this amount trigger CTR flags." />
              </label>
              <input
                type="number"
                value={formValues.cashThreshold}
                onChange={(e) => setFormValues({ ...formValues, cashThreshold: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
              />
              <span className="text-[10px] text-slate-500">Standard CTR mandatory reporting limit</span>
            </div>

            {/* Structuring Amount & Window */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block flex items-center justify-between">
                <span>Structuring Limit ({formValues.currency}) / Window</span>
                <Clock className="w-3 h-3 text-slate-500" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={formValues.structuringAmount}
                  onChange={(e) => setFormValues({ ...formValues, structuringAmount: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
                  placeholder="Min amount"
                />
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={formValues.structuringWindowDays}
                    onChange={(e) => setFormValues({ ...formValues, structuringWindowDays: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Days</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">Detects smurfing under CTR threshold</span>
            </div>

            {/* Layering Rapid Movement */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Layering Rapid Movement Window (Hours)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={formValues.layeringWindowHours}
                    onChange={(e) => setFormValues({ ...formValues, layeringWindowHours: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={formValues.layeringMinCount}
                    onChange={(e) => setFormValues({ ...formValues, layeringMinCount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Min Txs</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">Rapid velocity transfer frequency</span>
            </div>

            {/* Amount Anomaly Multiplier */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Volume Anomaly Multiplier (vs Avg)
              </label>
              <input
                type="number"
                step="0.5"
                value={formValues.amountAnomalyMultiplier}
                onChange={(e) => setFormValues({ ...formValues, amountAnomalyMultiplier: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
              />
              <span className="text-[10px] text-slate-500">Flags transactions &gt; Nx dataset average</span>
            </div>

          </div>

          {/* High-Risk Countries List */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center">
                <Globe className="w-3.5 h-3.5 mr-1.5 text-red-400" /> High-Risk Jurisdiction Country Codes (CSV)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ISO-2 Codes / Names</span>
            </label>
            <textarea
              rows={2}
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 font-mono text-xs focus:border-red-500 outline-none resize-none"
              placeholder="e.g. IR, KP, SY, RU, BY, KY, PA, CY, Iran, North Korea"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {countryInput.split(',').map((c, i) => {
                const code = c.trim().toUpperCase();
                if (!code) return null;
                return (
                  <span key={i} className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded font-mono">
                    {code}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Exchange Rate Conversion Table (EUR Reference) */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                <span>Reference Exchange Rates (1 FX Unit = X EUR)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Standardized Threshold Conversion</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              {Object.entries(formValues.exchangeRates || {}).slice(0, 8).map(([ccy, rate]) => (
                <div key={ccy} className="bg-slate-900 border border-slate-800 p-1.5 rounded flex items-center justify-between">
                  <span className="text-slate-400 font-bold">{ccy}:</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={rate}
                    onChange={(e) => {
                      const newVal = parseFloat(e.target.value) || 0;
                      setFormValues({
                        ...formValues,
                        exchangeRates: {
                          ...(formValues.exchangeRates || {}),
                          [ccy]: newVal
                        }
                      });
                    }}
                    className="w-16 bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-right text-emerald-400 text-[10px] focus:border-emerald-500 outline-none"
                  />
                </div>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">Converts non-EUR amounts (e.g. USD, JPY, GBP) into EUR reference values before threshold rule evaluation.</span>
          </div>

          {/* Toggles */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-slate-200">PEP (Politically Exposed Persons) Screening</div>
                  <div className="text-[10px] text-slate-400">Screens customer profiles for political or high-exposure roles</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formValues.pepScreening}
                onChange={(e) => setFormValues({ ...formValues, pepScreening: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
            </div>

            <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <div>
                  <div className="font-semibold text-slate-200">Sanctions Watchlist Screening</div>
                  <div className="text-[10px] text-slate-400">Matches counterparties against designated sanctions keywords</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formValues.sanctionsScreening}
                onChange={(e) => setFormValues({ ...formValues, sanctionsScreening: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
            </div>
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
            onClick={handleApply}
            className="px-5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Record Version & Re-Analyze</span>
          </button>
        </div>

      </div>
    </div>
  );
};
