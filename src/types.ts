export type JurisdictionType = 'EU' | 'US' | 'CUSTOM';

export type RiskTier = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';

export type AnalystTag = 'Unreviewed' | 'Confirmed Suspicious' | 'Determined False Positive' | 'Requires Continued Monitoring';

export interface ExpectedFields {
  transactionDate: string;
  amount: string;
  currency: string;
  sender: string;
  receiver: string;
  senderCountry: string;
  receiverCountry: string;
  accountNumber: string;
  transactionType: string;
  customerType: string;
}

export type FieldKey = keyof ExpectedFields;

export interface ColumnMapping {
  transactionDate: string;
  amount: string;
  currency: string;
  sender: string;
  receiver: string;
  senderCountry: string;
  receiverCountry: string;
  accountNumber: string;
  transactionType: string;
  customerType: string;
}

export interface JurisdictionThresholds {
  name: string;
  jurisdictionCode: JurisdictionType;
  cashThreshold: number;
  currency: string;
  structuringAmount: number;
  structuringWindowDays: number;
  layeringWindowHours: number;
  layeringMinCount: number;
  highRiskCountries: string[]; // ISO country codes or names
  pepScreening: boolean;
  sanctionsScreening: boolean;
  amountAnomalyMultiplier: number; // e.g. 3x mean amount
  sarDirective: string;
  fiuName: string;
  exchangeRates?: Record<string, number>;
}

export interface ThresholdVersionInfo {
  versionId: string;
  versionNumber: number;
  updatedAt: string;
  jurisdiction: JurisdictionType;
}

export interface RawTransactionRecord {
  [key: string]: any;
}

export interface ProcessedTransaction {
  id: string;
  rawRecord: RawTransactionRecord;
  transactionDate: string; // ISO String or readable date
  amount: number;
  currency: string;
  amountInEur: number; // Converted EUR amount for standardized rule comparison
  sender: string;
  receiver: string;
  senderCountry: string;
  receiverCountry: string;
  accountNumber: string;
  primaryAccount: string; // Primary Account Under Review
  transactionType: string; // Cash, Wire, Crypto, Transfer, etc.
  customerType: string; // Individual, Legal Entity, PEP, etc.
  
  // Risk Calculations
  riskScore: number; // 0 - 100
  riskTier: RiskTier;
  triggerReasons: TriggerReason[];
  
  // Narrative & Recommendation
  narrativeSummary?: string;
  recommendedAction?: string;
  
  // Analyst Workflow
  analystTag: AnalystTag;
  analystNotes?: string;
  taggedAt?: string;
}

export interface TriggerReason {
  code: string;
  category: 'Amount Anomaly' | 'Frequency Anomaly' | 'Geographic Risk' | 'PEP / Sanctions' | 'Structuring' | 'Layering';
  title: string;
  description: string;
  weight: number;
  severity: 'Medium' | 'High' | 'Critical';
}

export interface DatasetStats {
  totalTransactions: number;
  totalVolume: number;
  currencyMap: { [ccy: string]: number };
  dateStart: string;
  dateEnd: string;
  uniqueAccountsCount: number;
  highRiskTxCount: number;
  criticalTxCount: number;
}
