import { 
  JurisdictionType, 
  JurisdictionThresholds, 
  ColumnMapping, 
  RawTransactionRecord, 
  ProcessedTransaction, 
  TriggerReason, 
  RiskTier,
  DatasetStats 
} from '../types';

export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  EUR: 1.0,
  USD: 0.93,
  GBP: 1.17,
  JPY: 0.0059,
  AUD: 0.60,
  CAD: 0.68,
  CHF: 1.04,
  SGD: 0.69,
  HKD: 0.12,
  AED: 0.25,
  BRL: 0.17,
  INR: 0.011
};

export const JURISDICTION_PRESETS: Record<JurisdictionType, JurisdictionThresholds> = {
  EU: {
    name: 'European Union (AMLR / AMLD6)',
    jurisdictionCode: 'EU',
    cashThreshold: 10000,
    currency: 'EUR',
    structuringAmount: 8500,
    structuringWindowDays: 7,
    layeringWindowHours: 24,
    layeringMinCount: 3,
    highRiskCountries: ['IR', 'KP', 'MM', 'SY', 'RU', 'BY', 'AF', 'YE', 'SN', 'KY', 'PA', 'VE', 'CY', 'CU', 'SD', 'VG'],
    pepScreening: true,
    sanctionsScreening: true,
    amountAnomalyMultiplier: 3.5,
    sarDirective: 'Mandatory Suspicious Transaction Report (STR/SAR) filing with the national Financial Intelligence Unit (FIU) under EU AMLD6 Article 35 within 24-48 hours. Initiate Enhanced Due Diligence (EDD) and freeze funds if high-risk sanctions match is confirmed.',
    fiuName: 'EU FIU.net / National FIU',
    exchangeRates: { ...DEFAULT_EXCHANGE_RATES }
  },
  US: {
    name: 'United States (BSA / FinCEN)',
    jurisdictionCode: 'US',
    cashThreshold: 10000,
    currency: 'USD',
    structuringAmount: 9000,
    structuringWindowDays: 7,
    layeringWindowHours: 48,
    layeringMinCount: 3,
    highRiskCountries: ['IR', 'KP', 'CU', 'SY', 'RU', 'BY', 'VE', 'SD', 'MM', 'KY', 'VG', 'PA', 'CY'],
    pepScreening: true,
    sanctionsScreening: true,
    amountAnomalyMultiplier: 3.0,
    sarDirective: 'File a Suspicious Activity Report (SAR) with the Financial Crimes Enforcement Network (FinCEN) via BSA E-Filing System within 30 calendar days of initial detection. Perform OFAC screening and restrict funds if sanctioned entity detected.',
    fiuName: 'FinCEN (US Treasury)',
    exchangeRates: { ...DEFAULT_EXCHANGE_RATES }
  },
  CUSTOM: {
    name: 'Custom Enterprise Thresholds',
    jurisdictionCode: 'CUSTOM',
    cashThreshold: 7500,
    currency: 'USD',
    structuringAmount: 7000,
    structuringWindowDays: 5,
    layeringWindowHours: 24,
    layeringMinCount: 2,
    highRiskCountries: ['IR', 'KP', 'SY', 'RU', 'BY', 'KY', 'VG', 'PA', 'CY'],
    pepScreening: true,
    sanctionsScreening: true,
    amountAnomalyMultiplier: 2.5,
    sarDirective: 'Escalate internally to Chief Anti-Money Laundering Officer (CAMLO) and prepare internal SAR package for relevant regional regulator.',
    fiuName: 'Internal Compliance Board',
    exchangeRates: { ...DEFAULT_EXCHANGE_RATES }
  }
};

export const ADVISORY_DISCLAIMER = "This recommendation is advisory only. The final decision on whether to file a report must be made by a human compliance analyst.";

// Comprehensive country code and name alias mapping for robust geographic matching
const HIGH_RISK_COUNTRY_ALIASES: Record<string, string[]> = {
  IR: ['IRAN', 'ISLAMIC REPUBLIC OF IRAN', 'IR'],
  KP: ['NORTH KOREA', 'KOREA, DEMOCRATIC PEOPLE\'S REPUBLIC OF', 'DEMOCRATIC PEOPLE\'S REPUBLIC OF KOREA', 'DPRK', 'KP'],
  MM: ['MYANMAR', 'BURMA', 'MM'],
  SY: ['SYRIA', 'SYRIAN ARAB REPUBLIC', 'SY'],
  RU: ['RUSSIA', 'RUSSIAN FEDERATION', 'RU'],
  BY: ['BELARUS', 'BY'],
  AF: ['AFGHANISTAN', 'AF'],
  YE: ['YEMEN', 'YE'],
  SN: ['SENEGAL', 'SN'],
  KY: ['CAYMAN ISLANDS', 'CAYMAN', 'KY'],
  PA: ['PANAMA', 'PA'],
  VE: ['VENEZUELA', 'VE'],
  CU: ['CUBA', 'CU'],
  SD: ['SUDAN', 'SD'],
  VG: ['BRITISH VIRGIN ISLANDS', 'VIRGIN ISLANDS, BRITISH', 'BVI', 'VG'],
  CY: ['CYPRUS', 'CY']
};

/**
 * Robust geographic matching helper
 */
export function isHighRiskCountry(
  countryInput: string, 
  configuredHighRiskList: string[]
): { isHighRisk: boolean; matchedName: string; codeMatched: string } {
  if (!countryInput) return { isHighRisk: false, matchedName: '', codeMatched: '' };
  
  const inputUpper = countryInput.trim().toUpperCase();
  const configuredUpper = configuredHighRiskList.map(c => c.trim().toUpperCase());

  // 1. Direct match with configured code or name
  if (configuredUpper.includes(inputUpper)) {
    return { isHighRisk: true, matchedName: countryInput, codeMatched: inputUpper };
  }

  // 2. Check if input matches an alias of any configured high-risk country code
  for (const code of configuredUpper) {
    const aliases = HIGH_RISK_COUNTRY_ALIASES[code] || [];
    if (aliases.includes(inputUpper)) {
      return { isHighRisk: true, matchedName: countryInput, codeMatched: code };
    }
  }

  // 3. Check if input is a known alias whose root code is present in configured list
  for (const [code, aliases] of Object.entries(HIGH_RISK_COUNTRY_ALIASES)) {
    if (aliases.includes(inputUpper) && configuredUpper.some(c => c === code || aliases.includes(c))) {
      return { isHighRisk: true, matchedName: countryInput, codeMatched: code };
    }
  }

  return { isHighRisk: false, matchedName: '', codeMatched: '' };
}

/**
 * Converts any transaction currency amount to EUR reference currency using exchange rates table
 */
export function convertToEur(
  amount: number, 
  currency: string, 
  rates: Record<string, number> = DEFAULT_EXCHANGE_RATES
): number {
  const ccy = (currency || 'EUR').toUpperCase();
  const rate = rates[ccy] !== undefined ? rates[ccy] : 1.0;
  return amount * rate;
}

/**
 * Auto-detect column headers from uploaded raw header strings
 */
export function autoDetectColumns(headers: string[]): ColumnMapping {
  const normalized = headers.map(h => ({ original: h, clean: h.toLowerCase().replace(/[^a-z0-9]/g, '') }));

  const findMatch = (candidates: string[]): string => {
    for (const cand of candidates) {
      const match = normalized.find(item => item.clean.includes(cand));
      if (match) return match.original;
    }
    return '';
  };

  return {
    transactionDate: findMatch(['date', 'time', 'timestamp', 'txdate', 'createdat', 'dt']),
    amount: findMatch(['amount', 'sum', 'value', 'val', 'txamount', 'amt']),
    currency: findMatch(['currency', 'curr', 'ccy', 'unit']),
    sender: findMatch(['sender', 'originator', 'from', 'remitter', 'source', 'debtor', 'sendername']),
    receiver: findMatch(['receiver', 'beneficiary', 'to', 'payee', 'destination', 'creditor', 'receivername']),
    senderCountry: findMatch(['sendercountry', 'originatingcountry', 'fromcountry', 'sendercountrycode', 'origincountry']),
    receiverCountry: findMatch(['receivercountry', 'destinationcountry', 'tocountry', 'receivercountrycode', 'destcountry']),
    accountNumber: findMatch(['accountnumber', 'account', 'accno', 'accountid', 'iban', 'acc']),
    transactionType: findMatch(['transactiontype', 'txtype', 'type', 'channel', 'method', 'paymenttype']),
    customerType: findMatch(['customertype', 'custtype', 'typeentity', 'entitytype', 'category', 'pepflag'])
  };
}

/**
 * Parses numeric amount from string or number safely
 */
function parseAmount(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9.-]+/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Main Risk Engine
 */
export function analyzeTransactions(
  records: RawTransactionRecord[],
  mapping: ColumnMapping,
  thresholds: JurisdictionThresholds
): { processed: ProcessedTransaction[]; stats: DatasetStats } {
  if (!records || records.length === 0) {
    return {
      processed: [],
      stats: {
        totalTransactions: 0,
        totalVolume: 0,
        currencyMap: {},
        dateStart: 'N/A',
        dateEnd: 'N/A',
        uniqueAccountsCount: 0,
        highRiskTxCount: 0,
        criticalTxCount: 0
      }
    };
  }

  const exchangeRates = thresholds.exchangeRates || DEFAULT_EXCHANGE_RATES;

  // 1. Extract clean base fields & compute standardized amountInEur & sort by timestamp
  const items = records.map((rec, index) => {
    const rawDate = rec[mapping.transactionDate] || new Date().toISOString();
    const parsedDate = new Date(rawDate);
    const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    
    const amount = parseAmount(rec[mapping.amount]);
    const currency = String(rec[mapping.currency] || thresholds.currency || 'USD').toUpperCase();
    const amountInEur = convertToEur(amount, currency, exchangeRates);

    const sender = String(rec[mapping.sender] || 'Unknown Sender').trim();
    const receiver = String(rec[mapping.receiver] || 'Unknown Receiver').trim();
    const senderCountry = String(rec[mapping.senderCountry] || 'US').trim().toUpperCase();
    const receiverCountry = String(rec[mapping.receiverCountry] || 'US').trim().toUpperCase();
    const accountNumber = String(rec[mapping.accountNumber] || `ACC-${index + 1001}`).trim();
    const transactionType = String(rec[mapping.transactionType] || 'Wire Transfer').trim();
    const customerType = String(rec[mapping.customerType] || 'Individual').trim();

    return {
      id: `TXN-${index + 10001}`,
      rawRecord: rec,
      transactionDate: validDate.toISOString(),
      dateObj: validDate,
      amount,
      currency,
      amountInEur,
      sender,
      receiver,
      senderCountry,
      receiverCountry,
      accountNumber,
      transactionType,
      customerType,
      analystTag: 'Unreviewed' as const
    };
  });

  // Sort chronologically for pattern detection
  items.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  // Calculate dataset statistics in standardized EUR volume
  const totalVolumeEur = items.reduce((sum, item) => sum + item.amountInEur, 0);
  const avgAmountEur = items.length > 0 ? totalVolumeEur / items.length : 1;

  // Compute 95th percentile EUR amount for statistical volume anomaly calculation
  const sortedEurAmounts = items.map(i => i.amountInEur).sort((a, b) => a - b);
  const p95Index = Math.floor(sortedEurAmounts.length * 0.95);
  const p95EurAmount = sortedEurAmounts[Math.min(p95Index, sortedEurAmounts.length - 1)] || (avgAmountEur * 2);

  const accountHistoryMap: Map<string, typeof items> = new Map();
  const senderHistoryMap: Map<string, typeof items> = new Map();
  const uniqueAccounts = new Set<string>();
  const currencyMap: { [key: string]: number } = {};

  items.forEach(item => {
    uniqueAccounts.add(item.accountNumber);
    currencyMap[item.currency] = (currencyMap[item.currency] || 0) + item.amount;

    if (!accountHistoryMap.has(item.accountNumber)) {
      accountHistoryMap.set(item.accountNumber, []);
    }
    accountHistoryMap.get(item.accountNumber)!.push(item);

    const senderKey = item.sender.toLowerCase();
    if (!senderHistoryMap.has(senderKey)) {
      senderHistoryMap.set(senderKey, []);
    }
    senderHistoryMap.get(senderKey)!.push(item);
  });

  // --- PRE-PASS: Grouping Engine for Structuring & Smurfing Patterns (AML-STR-01) ---
  interface StructuringGroupData {
    senderName: string;
    txns: typeof items;
    txnIds: string[];
    totalGroupSumEur: number;
    spanDays: number;
    differingReceivers: boolean;
    weight: number;
    severity: 'High' | 'Critical';
    description: string;
  }

  const transactionStructuringGroupMap = new Map<string, StructuringGroupData>();

  // Group all transactions by Sender Account (or Sender Name)
  const senderGroupingMap = new Map<string, typeof items>();
  items.forEach(item => {
    const senderKey = (item.accountNumber && item.accountNumber.length > 5 && !item.accountNumber.startsWith('ACC-')) 
      ? item.accountNumber.trim().toLowerCase() 
      : item.sender.trim().toLowerCase();
    
    const nameKey = item.sender.trim().toLowerCase();

    if (!senderGroupingMap.has(senderKey)) {
      senderGroupingMap.set(senderKey, []);
    }
    senderGroupingMap.get(senderKey)!.push(item);

    if (nameKey !== senderKey) {
      if (!senderGroupingMap.has(nameKey)) {
        senderGroupingMap.set(nameKey, []);
      }
      if (!senderGroupingMap.get(nameKey)!.some(i => i.id === item.id)) {
        senderGroupingMap.get(nameKey)!.push(item);
      }
    }
  });

  const structuringWindowMs = thresholds.structuringWindowDays * 24 * 60 * 60 * 1000;

  senderGroupingMap.forEach((senderTxList) => {
    senderTxList.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // Qualifying transactions: individual EUR amount is below Cash Reporting Threshold (< thresholds.cashThreshold)
    const qualifyingTxns = senderTxList.filter(t => t.amountInEur < thresholds.cashThreshold && t.amountInEur > 0);

    if (qualifyingTxns.length < 2) return;

    for (let i = 0; i < qualifyingTxns.length; i++) {
      const startTx = qualifyingTxns[i];
      const cluster: typeof items = [startTx];

      for (let j = i + 1; j < qualifyingTxns.length; j++) {
        const nextTx = qualifyingTxns[j];
        if (nextTx.dateObj.getTime() - startTx.dateObj.getTime() <= structuringWindowMs) {
          cluster.push(nextTx);
        }
      }

      if (cluster.length >= 2) {
        const totalGroupSumEur = cluster.reduce((sum, t) => sum + t.amountInEur, 0);
        const linkedTxnIds = cluster.map(t => t.id);

        const receivers = new Set(cluster.map(t => t.receiver.trim().toLowerCase()));
        const differingReceivers = receivers.size > 1;

        const minMs = Math.min(...cluster.map(t => t.dateObj.getTime()));
        const maxMs = Math.max(...cluster.map(t => t.dateObj.getTime()));
        const diffMs = maxMs - minMs;
        const rawDays = diffMs / (1000 * 60 * 60 * 24);
        const spanDays = Math.max(1, Math.round(rawDays) || 1);

        const ratio = totalGroupSumEur / thresholds.cashThreshold;
        const weight = Math.min(75, Math.max(45, Math.round(35 + (cluster.length * 5) + (ratio * 5))));
        const severity: 'High' | 'Critical' = weight >= 60 ? 'Critical' : 'High';

        const senderDisplayName = startTx.sender;
        const totalFormattedEur = Math.round(totalGroupSumEur).toLocaleString();

        const description = `Structuring pattern detected — part of a group of ${cluster.length} transactions from ${senderDisplayName} totaling EUR ${totalFormattedEur} within ${spanDays} day${spanDays > 1 ? 's' : ''} (linked: ${linkedTxnIds.join(', ')})${differingReceivers ? ' [Possible layering via multiple receivers]' : ''}`;

        const groupData: StructuringGroupData = {
          senderName: senderDisplayName,
          txns: cluster,
          txnIds: linkedTxnIds,
          totalGroupSumEur,
          spanDays,
          differingReceivers,
          weight,
          severity,
          description
        };

        cluster.forEach(tx => {
          const existing = transactionStructuringGroupMap.get(tx.id);
          if (!existing || existing.txnIds.length < groupData.txnIds.length) {
            transactionStructuringGroupMap.set(tx.id, groupData);
          }
        });
      }
    }
  });

  let highRiskCount = 0;
  let criticalRiskCount = 0;

  // 2. Evaluate Risk Factors per Transaction using converted EUR values
  const processed: ProcessedTransaction[] = items.map((item) => {
    const triggers: TriggerReason[] = [];
    let rawScore = 0;

    // --- RULE 1: Regulatory Cash Reporting Thresholds (Converted EUR Amount) ---
    if (item.amountInEur >= thresholds.cashThreshold) {
      const isCash = item.transactionType.toLowerCase().includes('cash') || item.transactionType.toLowerCase().includes('atm');
      const weight = isCash ? 35 : 25;
      rawScore += weight;
      triggers.push({
        code: 'AML-AMT-01',
        category: 'Amount Anomaly',
        title: 'Exceeds Regulatory Cash Reporting Threshold',
        description: `Transaction amount (${item.currency} ${item.amount.toLocaleString()} ≈ EUR ${item.amountInEur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) meets or exceeds the regulatory threshold (EUR ${thresholds.cashThreshold.toLocaleString()}).`,
        weight,
        severity: 'High'
      });
    } else if (item.amountInEur >= thresholds.cashThreshold * 0.75) {
      rawScore += 15;
      triggers.push({
        code: 'AML-AMT-02',
        category: 'Amount Anomaly',
        title: 'Near-Threshold High Value Amount',
        description: `Transaction amount (${item.currency} ${item.amount.toLocaleString()} ≈ EUR ${item.amountInEur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) is within 25% of mandatory reporting limit (EUR ${thresholds.cashThreshold.toLocaleString()}).`,
        weight: 15,
        severity: 'Medium'
      });
    }

    // --- RULE 1b: Statistical Volume Anomaly (Top 5% Distribution & Multiplier) ---
    if (avgAmountEur > 0 && (item.amountInEur >= p95EurAmount || item.amountInEur >= avgAmountEur * thresholds.amountAnomalyMultiplier)) {
      const weight = 20;
      rawScore += weight;
      const timesAvg = (item.amountInEur / avgAmountEur).toFixed(1);
      triggers.push({
        code: 'AML-AMT-03',
        category: 'Amount Anomaly',
        title: 'Statistical Volume Anomaly (Top 5% Distribution)',
        description: `Transaction amount (${item.currency} ${item.amount.toLocaleString()} ≈ EUR ${item.amountInEur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) is in the top 5% of this dataset's volume distribution and ${timesAvg}x higher than the dataset mean (EUR ${Math.round(avgAmountEur).toLocaleString()}).`,
        weight,
        severity: 'Medium'
      });
    }

    // --- RULE 2: Geographic Risk (Bug 2 Fix) ---
    const senderGeoMatch = isHighRiskCountry(item.senderCountry, thresholds.highRiskCountries);
    const receiverGeoMatch = isHighRiskCountry(item.receiverCountry, thresholds.highRiskCountries);

    if (senderGeoMatch.isHighRisk || receiverGeoMatch.isHighRisk) {
      const weight = (senderGeoMatch.isHighRisk && receiverGeoMatch.isHighRisk) ? 40 : 30;
      rawScore += weight;

      const sideDetails = [
        senderGeoMatch.isHighRisk ? `Sender (${item.senderCountry})` : null,
        receiverGeoMatch.isHighRisk ? `Receiver (${item.receiverCountry})` : null
      ].filter(Boolean).join(' & ');

      triggers.push({
        code: 'AML-GEO-01',
        category: 'Geographic Risk',
        title: 'High-Risk Jurisdiction Counterparty Match',
        description: `Transaction corridor involves high-risk country list: ${sideDetails}. Jurisdictional risk weight (+${weight}) applied.`,
        weight,
        severity: (senderGeoMatch.isHighRisk && receiverGeoMatch.isHighRisk) ? 'Critical' : 'High'
      });
    }

    // --- RULE 3: PEP & Sanctions Screening ---
    const custTypeUpper = item.customerType.toUpperCase();
    const senderUpper = item.sender.toUpperCase();
    const receiverUpper = item.receiver.toUpperCase();

    const isPEP = custTypeUpper.includes('PEP') || custTypeUpper.includes('POLITICALLY') || senderUpper.includes('MINISTER') || receiverUpper.includes('AMBASSADOR');
    const isSanctions = custTypeUpper.includes('SANCTION') || senderUpper.includes('SANCTION') || receiverUpper.includes('OFFSHORE') || receiverUpper.includes('SHELL');

    if (thresholds.pepScreening && isPEP) {
      const weight = 35;
      rawScore += weight;
      triggers.push({
        code: 'AML-PEP-01',
        category: 'PEP / Sanctions',
        title: 'Politically Exposed Person (PEP) Flag',
        description: `Customer or counterparty is identified as a Politically Exposed Person (${item.customerType}). Requires Enhanced Due Diligence.`,
        weight,
        severity: 'High'
      });
    }

    if (thresholds.sanctionsScreening && isSanctions) {
      const weight = 45;
      rawScore += weight;
      triggers.push({
        code: 'AML-SNC-01',
        category: 'PEP / Sanctions',
        title: 'Sanctions / High-Risk Watchlist Keyword Match',
        description: `Entity matches sanctioned watchlist keyword or designated offshore entity profile.`,
        weight,
        severity: 'Critical'
      });
    }

    // --- RULE 4: Structuring / Smurfing Pattern (AML-STR-01) ---
    const structuringGroup = transactionStructuringGroupMap.get(item.id);
    if (structuringGroup) {
      rawScore += structuringGroup.weight;
      triggers.push({
        code: 'AML-STR-01',
        category: 'Structuring',
        title: 'Smurfing / Structuring Multi-Transaction Pattern',
        description: structuringGroup.description,
        weight: structuringGroup.weight,
        severity: structuringGroup.severity
      });
    }

    // --- RULE 5: Rapid Movement / Layering Pattern ---
    const layeringWindowStart = new Date(item.dateObj.getTime() - thresholds.layeringWindowHours * 60 * 60 * 1000);
    const accountTxList = accountHistoryMap.get(item.accountNumber) || [];
    const rapidTxCount = accountTxList.filter(t => t.dateObj >= layeringWindowStart && t.dateObj <= item.dateObj).length;

    if (rapidTxCount >= thresholds.layeringMinCount) {
      const weight = 25;
      rawScore += weight;
      triggers.push({
        code: 'AML-LAY-01',
        category: 'Layering',
        title: 'Rapid Velocity / Layering Indicator',
        description: `${rapidTxCount} rapid transactions recorded for account ${item.accountNumber} within a ${thresholds.layeringWindowHours}-hour window.`,
        weight,
        severity: 'High'
      });
    }

    // Final Composite Score (0 - 100)
    const finalScore = Math.min(100, Math.round(rawScore));

    let riskTier: RiskTier = 'Low Risk';
    if (finalScore >= 85) {
      riskTier = 'Critical Risk';
      criticalRiskCount++;
    } else if (finalScore >= 60) {
      riskTier = 'High Risk';
      highRiskCount++;
    } else if (finalScore >= 30) {
      riskTier = 'Medium Risk';
    }

    // Identify Primary Account Under Review
    let primaryAccount = item.accountNumber;
    if (receiverGeoMatch.isHighRisk || isSanctions) {
      primaryAccount = `${item.receiver} (${item.receiverCountry})`;
    } else {
      primaryAccount = `${item.accountNumber} [${item.sender}]`;
    }

    // Generate Narrative & Recommendations if High or Critical
    let narrativeSummary: string | undefined = undefined;
    let recommendedAction: string | undefined = undefined;

    if (finalScore >= 60) {
      const topReasons = triggers.map(t => t.title).join('; ');
      narrativeSummary = `Transaction ${item.id} (${item.currency} ${item.amount.toLocaleString()} ≈ EUR ${item.amountInEur.toLocaleString(undefined, { maximumFractionDigits: 2 })} on ${item.transactionDate.split('T')[0]}) presents a ${riskTier} AML profile (Composite Score: ${finalScore}/100). Primary trigger factors include: ${topReasons || 'Multiple cumulative risk indicators'}. The sender (${item.sender} - ${item.senderCountry}) and receiver (${item.receiver} - ${item.receiverCountry}) transaction corridor warrants immediate regulatory escalation.`;

      recommendedAction = `${thresholds.sarDirective}`;
    }

    return {
      id: item.id,
      rawRecord: item.rawRecord,
      transactionDate: item.transactionDate,
      amount: item.amount,
      currency: item.currency,
      amountInEur: item.amountInEur,
      sender: item.sender,
      receiver: item.receiver,
      senderCountry: item.senderCountry,
      receiverCountry: item.receiverCountry,
      accountNumber: item.accountNumber,
      primaryAccount,
      transactionType: item.transactionType,
      customerType: item.customerType,
      riskScore: finalScore,
      riskTier,
      triggerReasons: triggers,
      narrativeSummary,
      recommendedAction,
      analystTag: 'Unreviewed'
    };
  });

  // Sort final processed records by risk score descending
  processed.sort((a, b) => b.riskScore - a.riskScore);

  const dateStart = items.length > 0 ? items[0].transactionDate.split('T')[0] : 'N/A';
  const dateEnd = items.length > 0 ? items[items.length - 1].transactionDate.split('T')[0] : 'N/A';

  return {
    processed,
    stats: {
      totalTransactions: items.length,
      totalVolume: totalVolumeEur,
      currencyMap,
      dateStart,
      dateEnd,
      uniqueAccountsCount: uniqueAccounts.size,
      highRiskTxCount: highRiskCount,
      criticalTxCount: criticalRiskCount
    }
  };
}

