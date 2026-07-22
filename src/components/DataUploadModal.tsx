import React, { useState } from 'react';
import { Upload, X, ArrowRight, CheckCircle2, AlertCircle, FileText, Database } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ColumnMapping, ExpectedFields, RawTransactionRecord, FieldKey } from '../types';
import { autoDetectColumns } from '../utils/amlRules';
import { SAMPLE_DATASETS } from '../utils/sampleData';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: RawTransactionRecord[], mapping: ColumnMapping, datasetName: string) => void;
}

const FIELD_LABELS: Record<FieldKey, string> = {
  transactionDate: 'Transaction Date / Time',
  amount: 'Transaction Amount',
  currency: 'Currency Code',
  sender: 'Sender / Originator Name',
  receiver: 'Receiver / Beneficiary Name',
  senderCountry: 'Sender Country / Jurisdiction',
  receiverCountry: 'Receiver Country / Jurisdiction',
  accountNumber: 'Account Number / IBAN',
  transactionType: 'Transaction / Channel Type',
  customerType: 'Customer / Entity Type (PEP)'
};

export const DataUploadModal: React.FC<DataUploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded
}) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<RawTransactionRecord[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    transactionDate: '',
    amount: '',
    currency: '',
    sender: '',
    receiver: '',
    senderCountry: '',
    receiverCountry: '',
    accountNumber: '',
    transactionType: '',
    customerType: ''
  });
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setErrorMsg('');
    setFileName(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const rawHeaders = results.meta.fields || Object.keys(results.data[0]);
            const rows = results.data as RawTransactionRecord[];
            setupMappingStep(rawHeaders, rows);
          } else {
            setErrorMsg('CSV file is empty or missing valid headers.');
          }
        },
        error: (err) => {
          setErrorMsg(`CSV Parse Error: ${err.message}`);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          const workbook = XLSX.read(buffer, { type: 'binary' });
          const firstSheet = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheet];
          const jsonData = XLSX.utils.sheet_to_json<RawTransactionRecord>(sheet, { defval: '' });
          
          if (jsonData.length > 0) {
            const rawHeaders = Object.keys(jsonData[0]);
            setupMappingStep(rawHeaders, jsonData);
          } else {
            setErrorMsg('Excel sheet contains no rows.');
          }
        } catch (err: any) {
          setErrorMsg(`Excel Reading Error: ${err.message || err}`);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setErrorMsg('Unsupported file type. Please upload a .csv, .xlsx, or .xls file.');
    }
  };

  const setupMappingStep = (rawHeaders: string[], rows: RawTransactionRecord[]) => {
    setHeaders(rawHeaders);
    setParsedRows(rows);
    const detected = autoDetectColumns(rawHeaders);
    setMapping(detected);
    setStep('mapping');
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DATASETS.find(s => s.id === sampleId);
    if (!sample) return;

    setFileName(sample.name);
    const rawHeaders = Object.keys(sample.data[0]);
    setHeaders(rawHeaders);
    setParsedRows(sample.data);
    const detected = autoDetectColumns(rawHeaders);
    setMapping(detected);
    setStep('mapping');
  };

  const handleConfirmMapping = () => {
    // Validate required fields
    if (!mapping.amount || !mapping.transactionDate) {
      setErrorMsg('Please map at least "Transaction Date" and "Transaction Amount" before proceeding.');
      return;
    }
    setErrorMsg('');
    setStep('preview');
  };

  const handleFinalAnalyze = () => {
    onDataLoaded(parsedRows, mapping, fileName || 'Uploaded Dataset');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-base text-slate-100">Import AML Dataset</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-red-950/50 border-b border-red-800/80 text-red-300 px-6 py-2.5 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {step === 'upload' && (
            <div className="space-y-6">
              {/* File Drag Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-900/40 hover:bg-slate-800/20 transition-all cursor-pointer group"
              >
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id="aml-file-input"
                />
                <label htmlFor="aml-file-input" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">Click to upload or drag & drop CSV / Excel file</span>
                  <span className="text-xs text-slate-400 mt-1">Supports .csv, .xlsx, .xls formatted data</span>
                </label>
              </div>

              {/* Sample Datasets Selector */}
              <div className="border-t border-slate-800 pt-5">
                <div className="flex items-center space-x-2 mb-3">
                  <Database className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Or Select a Sample Testing Dataset</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAMPLE_DATASETS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSample(sample.id)}
                      className="text-left p-3.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/80 hover:border-slate-700 transition-colors group"
                    >
                      <div className="font-semibold text-xs text-slate-200 group-hover:text-blue-300 transition-colors">
                        {sample.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {sample.description}
                      </div>
                      <div className="text-[10px] text-blue-400 font-mono mt-2 flex items-center">
                        <span>Load dataset ({sample.data.length} records)</span>
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded border border-slate-700/80">
                <div className="text-xs text-slate-300">
                  File: <strong className="text-white">{fileName}</strong> ({parsedRows.length} rows, {headers.length} columns)
                </div>
                <button
                  onClick={() => setStep('upload')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Change File
                </button>
              </div>

              <div className="text-xs text-slate-400">
                System auto-detected column headers below. Adjust column mappings if any field is unmapped or incorrectly matched.
              </div>

              {/* Mapping Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {(Object.keys(FIELD_LABELS) as FieldKey[]).map((fieldKey) => (
                  <div key={fieldKey} className="bg-slate-900 border border-slate-800 p-2.5 rounded flex flex-col justify-between">
                    <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between">
                      <span>{FIELD_LABELS[fieldKey]}</span>
                      {(fieldKey === 'amount' || fieldKey === 'transactionDate') && (
                        <span className="text-[9px] text-amber-400 font-mono">* Required</span>
                      )}
                    </label>
                    <select
                      value={mapping[fieldKey] || ''}
                      onChange={(e) => setMapping({ ...mapping, [fieldKey]: e.target.value })}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded p-1.5 focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Do Not Map / Unmapped --</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400">Dataset Overview</div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">{parsedRows.length} Transaction Records</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-medium flex items-center justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready for AML Risk Engine
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Schema mappings verified</div>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-300">Data Sample Preview (First 5 Rows)</div>

              <div className="border border-slate-800 rounded overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Sender</th>
                      <th className="p-2">Receiver</th>
                      <th className="p-2">S.Country</th>
                      <th className="p-2">R.Country</th>
                      <th className="p-2">Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2 font-mono text-slate-400">{String(row[mapping.transactionDate] || 'N/A')}</td>
                        <td className="p-2 font-semibold text-white">{String(row[mapping.amount] || '0')} {String(row[mapping.currency] || '')}</td>
                        <td className="p-2 text-slate-200">{String(row[mapping.sender] || '-')}</td>
                        <td className="p-2 text-slate-200">{String(row[mapping.receiver] || '-')}</td>
                        <td className="p-2 font-mono">{String(row[mapping.senderCountry] || '-')}</td>
                        <td className="p-2 font-mono">{String(row[mapping.receiverCountry] || '-')}</td>
                        <td className="p-2 font-mono text-slate-400">{String(row[mapping.accountNumber] || '-')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          {step === 'upload' && (
            <div className="text-xs text-slate-500">Select a file or sample dataset to begin.</div>
          )}

          {step === 'mapping' && (
            <>
              <button
                onClick={() => setStep('upload')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirmMapping}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <span>Continue to Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button
                onClick={() => setStep('mapping')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
              >
                Back to Mapping
              </button>
              <button
                onClick={handleFinalAnalyze}
                className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>Run AML Risk Analysis</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
