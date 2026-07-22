import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  ArrowUpDown, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ProcessedTransaction, RiskTier, AnalystTag, JurisdictionThresholds } from '../types';
import { AlertDetailPanel } from './AlertDetailPanel';

interface RiskTableProps {
  alerts: ProcessedTransaction[];
  thresholds: JurisdictionThresholds;
  onUpdateTag: (id: string, tag: AnalystTag, notes?: string) => void;
}

export const RiskTable: React.FC<RiskTableProps> = ({
  alerts,
  thresholds,
  onUpdateTag
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortField, setSortField] = useState<'riskScore' | 'amount' | 'transactionDate'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter & Sort Logic
  const filteredAlerts = useMemo(() => {
    // Reset to first page on search or filter change
    setCurrentPage(1);

    return alerts
      .filter((item) => {
        // Search term match
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchSender = item.sender.toLowerCase().includes(q);
          const matchReceiver = item.receiver.toLowerCase().includes(q);
          const matchAccount = item.accountNumber.toLowerCase().includes(q);
          const matchCountry = item.senderCountry.toLowerCase().includes(q) || item.receiverCountry.toLowerCase().includes(q);
          const matchId = item.id.toLowerCase().includes(q);
          const matchTriggers = item.triggerReasons.some(t => t.code.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));

          if (!matchSender && !matchReceiver && !matchAccount && !matchCountry && !matchId && !matchTriggers) {
            return false;
          }
        }

        // Tier filter
        if (selectedTier !== 'All' && item.riskTier !== selectedTier) {
          return false;
        }

        // Analyst Tag filter
        if (selectedTag !== 'All' && item.analystTag !== selectedTag) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'transactionDate') {
          valA = new Date(a.transactionDate).getTime();
          valB = new Date(b.transactionDate).getTime();
        }

        if (sortOrder === 'desc') {
          return (valB as number) - (valA as number);
        } else {
          return (valA as number) - (valB as number);
        }
      });
  }, [alerts, searchTerm, selectedTier, selectedTag, sortField, sortOrder]);

  const totalRecords = filteredAlerts.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedAlerts = useMemo(() => {
    return filteredAlerts.slice(startIndex, endIndex);
  }, [filteredAlerts, startIndex, endIndex]);

  const toggleSort = (field: 'riskScore' | 'amount' | 'transactionDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getTierBadgeClass = (tier: RiskTier) => {
    switch (tier) {
      case 'Critical Risk':
        return 'bg-red-950/80 text-red-300 border-red-700/80 font-bold';
      case 'High Risk':
        return 'bg-red-900/30 text-red-400 border-red-800/60 font-semibold';
      case 'Medium Risk':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80 font-semibold';
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700 font-medium';
    }
  };

  const getTagBadgeClass = (tag: AnalystTag) => {
    switch (tag) {
      case 'Confirmed Suspicious':
        return 'bg-red-600 text-white font-bold';
      case 'Determined False Positive':
        return 'bg-emerald-700 text-white font-semibold';
      case 'Requires Continued Monitoring':
        return 'bg-amber-500 text-slate-950 font-bold';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      
      {/* Search & Filter Header Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sender, receiver, account, country, or rule ID..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2 text-xs">
          
          {/* Tier Dropdown */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Risk Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Critical Risk">Critical Risk (85-100)</option>
              <option value="High Risk">High Risk (60-84)</option>
              <option value="Medium Risk">Medium Risk (30-59)</option>
              <option value="Low Risk">Low Risk (0-29)</option>
            </select>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-medium">Analyst Status:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Unreviewed">Unreviewed</option>
              <option value="Confirmed Suspicious">Confirmed Suspicious</option>
              <option value="Determined False Positive">False Positive</option>
              <option value="Requires Continued Monitoring">Requires Monitoring</option>
            </select>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Showing <strong>{filteredAlerts.length}</strong> of {alerts.length} records
          </div>

        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800 sticky top-0 z-20">
            <tr>
              <th className="p-3 w-10">#</th>
              <th 
                onClick={() => toggleSort('riskScore')}
                className="p-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Risk Score & Tier</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th 
                onClick={() => toggleSort('transactionDate')}
                className="p-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Date / Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="p-3">Primary Account Under Review</th>
              <th className="p-3">Corridor (From &rarr; To)</th>
              <th 
                onClick={() => toggleSort('amount')}
                className="p-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Amount (Original & EUR)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="p-3">Trigger Reasons</th>
              <th className="p-3">Analyst Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-200">
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 italic">
                  No transaction records match the selected filter criteria.
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((item, idx) => {
                const isExpanded = expandedId === item.id;
                const globalIndex = startIndex + idx + 1;

                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className={`hover:bg-slate-800/70 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-800/90 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <td className="p-3 text-slate-500 font-mono">{globalIndex}</td>

                      {/* Score & Tier Badge */}
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-md border text-xs font-mono font-bold ${getTierBadgeClass(item.riskTier)}`}>
                            {item.riskScore} • {item.riskTier}
                          </span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="p-3 font-mono text-slate-400 text-[11px]">
                        {item.transactionDate.replace('T', ' ').slice(0, 16)}
                      </td>

                      {/* Primary Account Under Review */}
                      <td className="p-3">
                        <div className="font-semibold text-blue-300 font-mono text-[11px]">{item.primaryAccount}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.customerType} • {item.transactionType}
                        </div>
                      </td>

                      {/* Corridor */}
                      <td className="p-3">
                        <div className="font-medium text-slate-100">{item.sender} &rarr; {item.receiver}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Corridor: <span className="text-slate-200">{item.senderCountry}</span> &rarr; <span className="text-slate-200">{item.receiverCountry}</span>
                        </div>
                      </td>

                      {/* Amount (Original & EUR) */}
                      <td className="p-3 font-mono">
                        <div className="font-bold text-slate-100">
                          {item.currency} {item.amount.toLocaleString()}
                        </div>
                        {item.currency !== 'EUR' && (
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            ≈ EUR {item.amountInEur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </td>

                      {/* Triggers summary */}
                      <td className="p-3">
                        {item.triggerReasons.length === 0 ? (
                          <span className="text-[11px] text-slate-500">Normal</span>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[10px] border border-amber-800/80 font-bold">
                              {item.triggerReasons.length} Rules
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[150px]" title={item.triggerReasons.map(t => t.title).join(', ')}>
                              {item.triggerReasons[0]?.title}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status Tag */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${getTagBadgeClass(item.analystTag)}`}>
                          {item.analystTag}
                        </span>
                      </td>

                      {/* Expand Button */}
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(isExpanded ? null : item.id);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 rounded text-xs font-medium inline-flex items-center space-x-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Close' : 'Inspect'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Row Detail */}
                    {isExpanded && (
                      <tr className="bg-slate-950 border-b border-slate-800">
                        <td colSpan={9} className="p-4">
                          <AlertDetailPanel
                            alert={item}
                            thresholds={thresholds}
                            onUpdateTag={onUpdateTag}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Bar */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        
        {/* Record count indicator */}
        <div>
          Showing <strong className="text-slate-200">{totalRecords === 0 ? 0 : startIndex + 1}</strong> to <strong className="text-slate-200">{endIndex}</strong> of <strong className="text-slate-200">{totalRecords.toLocaleString()}</strong> records
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center space-x-2">
          
          {/* Rows per page selector */}
          <div className="flex items-center space-x-1 mr-2">
            <span className="text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-1.5 py-0.5 text-xs outline-none focus:border-blue-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
            </select>
          </div>

          <button
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage <= 1}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-bold transition-colors"
            title="First Page"
          >
            &laquo;
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={safeCurrentPage <= 1}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Previous Page"
          >
            &lsaquo; Prev
          </button>

          <span className="px-2 py-1 text-slate-300 font-semibold bg-slate-950 border border-slate-800 rounded">
            Page {safeCurrentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage >= totalPages}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Next Page"
          >
            Next &rsaquo;
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 font-bold transition-colors"
            title="Last Page"
          >
            &raquo;
          </button>

        </div>

      </div>

    </div>
  );
};
