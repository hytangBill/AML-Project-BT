import { RawTransactionRecord } from '../types';

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  data: RawTransactionRecord[];
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'demo-general',
    name: 'Demo: General Transaction Sample',
    description: 'A realistic mix of 15 multi-currency transactions covering ordinary low-risk transfers, near-threshold amounts, PEP transfers, and high-risk jurisdiction corridors. Sample data for demonstration — not real financial data.',
    data: [
      {
        transaction_date: '2026-07-18T09:15:00Z',
        amount: 2500,
        currency: 'EUR',
        sender: 'Maria Garcia',
        receiver: 'Eduardo Silva',
        sender_country: 'ES',
        receiver_country: 'PT',
        account_number: 'ES12987654321',
        transaction_type: 'SEPA Transfer',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-18T14:30:00Z',
        amount: 9900,
        currency: 'USD',
        sender: 'BlueSky Holding Inc',
        receiver: 'Global Logistics Trading',
        sender_country: 'US',
        receiver_country: 'GB',
        account_number: 'US9933001122',
        transaction_type: 'SWIFT Wire',
        customer_type: 'Corporate Entity'
      },
      {
        transaction_date: '2026-07-19T10:00:00Z',
        amount: 450,
        currency: 'EUR',
        sender: 'David Miller',
        receiver: 'Supermarket Central',
        sender_country: 'FR',
        receiver_country: 'FR',
        account_number: 'FR76300040001',
        transaction_type: 'POS Card Payment',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-19T16:00:00Z',
        amount: 145000,
        currency: 'EUR',
        sender: 'Victor Vance',
        receiver: 'Alpine Investment Trust',
        sender_country: 'DE',
        receiver_country: 'CH',
        account_number: 'DE44100200300987654321',
        transaction_type: 'Wire Transfer',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-20T08:20:00Z',
        amount: 32000,
        currency: 'EUR',
        sender: 'Nordic Tech Corp',
        receiver: 'Pyongyang Precision Instruments',
        sender_country: 'SE',
        receiver_country: 'KP',
        account_number: 'SE918000112233',
        transaction_type: 'Wire Transfer',
        customer_type: 'Legal Entity - Sanctioned'
      },
      {
        transaction_date: '2026-07-20T11:15:00Z',
        amount: 1200,
        currency: 'USD',
        sender: 'Sarah Connor',
        receiver: 'Tech Equipment Store',
        sender_country: 'US',
        receiver_country: 'US',
        account_number: 'US1122334455',
        transaction_type: 'ACH Debit',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-20T15:30:00Z',
        amount: 250000,
        currency: 'USD',
        sender: 'General Alexander Romanov',
        receiver: 'Panama Horizon Holdings',
        sender_country: 'RU',
        receiver_country: 'PA',
        account_number: 'RU9988776655',
        transaction_type: 'Wire Transfer',
        customer_type: 'PEP - Military Official'
      },
      {
        transaction_date: '2026-07-21T09:00:00Z',
        amount: 6400,
        currency: 'GBP',
        sender: 'London Real Estate Advisory',
        receiver: 'Oxford Legal Services',
        sender_country: 'GB',
        receiver_country: 'GB',
        account_number: 'GB29NWBK601613',
        transaction_type: 'Faster Payment',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-21T13:45:00Z',
        amount: 89000,
        currency: 'EUR',
        sender: 'Tehran Petrochemical Exporters',
        receiver: 'Balkan Trade Agency',
        sender_country: 'IR',
        receiver_country: 'BY',
        account_number: 'IR1000998877',
        transaction_type: 'International Transfer',
        customer_type: 'High Risk Entity'
      },
      {
        transaction_date: '2026-07-21T17:20:00Z',
        amount: 3200,
        currency: 'EUR',
        sender: 'Antoine Dubois',
        receiver: 'Sophie Laurent',
        sender_country: 'FR',
        receiver_country: 'FR',
        account_number: 'FR12345678',
        transaction_type: 'SEPA Direct',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-22T08:30:00Z',
        amount: 18500,
        currency: 'USD',
        sender: 'Dmitry Volkov',
        receiver: 'Geneva Asset Management',
        sender_country: 'RU',
        receiver_country: 'CH',
        account_number: 'RU40817810000',
        transaction_type: 'International Wire',
        customer_type: 'PEP - State Officer'
      },
      {
        transaction_date: '2026-07-22T10:10:00Z',
        amount: 850,
        currency: 'EUR',
        sender: 'Elena Rossi',
        receiver: 'Milano Fashion Supplies',
        sender_country: 'IT',
        receiver_country: 'IT',
        account_number: 'IT60X0542811101',
        transaction_type: 'SEPA Transfer',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-22T12:00:00Z',
        amount: 9800,
        currency: 'EUR',
        sender: 'Helios Trading GmbH',
        receiver: 'Apex Logistics LLC',
        sender_country: 'DE',
        receiver_country: 'NL',
        account_number: 'DE89370400440532013000',
        transaction_type: 'Cash Deposit',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-22T14:15:00Z',
        amount: 51000,
        currency: 'USD',
        sender: 'Pacific Commercial Ltd',
        receiver: 'Tokyo Electronics Corp',
        sender_country: 'US',
        receiver_country: 'JP',
        account_number: 'US8877665544',
        transaction_type: 'SWIFT Wire',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-22T16:00:00Z',
        amount: 1500,
        currency: 'EUR',
        sender: 'Klaus Schmidt',
        receiver: 'Berlin Utility Services',
        sender_country: 'DE',
        receiver_country: 'DE',
        account_number: 'DE1112223334',
        transaction_type: 'Direct Debit',
        customer_type: 'Individual'
      }
    ]
  },
  {
    id: 'demo-structuring',
    name: 'Demo: Structuring Case Study',
    description: 'A targeted case study demonstrating multi-transaction pattern detection (AML-STR-01). Features 4 sub-10,000 EUR payments from Helios Trading GmbH to Apex Logistics LLC totaling EUR 38,450 within 4 days, alongside control transactions. Sample data for demonstration — not real financial data.',
    data: [
      {
        transaction_date: '2026-07-18T09:15:00Z',
        amount: 9800,
        currency: 'EUR',
        sender: 'Helios Trading GmbH',
        receiver: 'Apex Logistics LLC',
        sender_country: 'DE',
        receiver_country: 'NL',
        account_number: 'DE89370400440532013000',
        transaction_type: 'Cash Deposit',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-19T11:30:00Z',
        amount: 9500,
        currency: 'EUR',
        sender: 'Helios Trading GmbH',
        receiver: 'Apex Logistics LLC',
        sender_country: 'DE',
        receiver_country: 'NL',
        account_number: 'DE89370400440532013000',
        transaction_type: 'Cash Deposit',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-20T14:45:00Z',
        amount: 9750,
        currency: 'EUR',
        sender: 'Helios Trading GmbH',
        receiver: 'Apex Logistics LLC',
        sender_country: 'DE',
        receiver_country: 'NL',
        account_number: 'DE89370400440532013000',
        transaction_type: 'Cash Deposit',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-22T12:00:00Z',
        amount: 9400,
        currency: 'EUR',
        sender: 'Helios Trading GmbH',
        receiver: 'Apex Logistics LLC',
        sender_country: 'DE',
        receiver_country: 'NL',
        account_number: 'DE89370400440532013000',
        transaction_type: 'Cash Deposit',
        customer_type: 'Legal Entity'
      },
      {
        transaction_date: '2026-07-20T10:00:00Z',
        amount: 2500,
        currency: 'EUR',
        sender: 'Maria Garcia',
        receiver: 'Eduardo Silva',
        sender_country: 'ES',
        receiver_country: 'PT',
        account_number: 'ES12987654321',
        transaction_type: 'SEPA Transfer',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-21T08:30:00Z',
        amount: 450,
        currency: 'EUR',
        sender: 'David Miller',
        receiver: 'Supermarket Central',
        sender_country: 'FR',
        receiver_country: 'FR',
        account_number: 'FR76300040001',
        transaction_type: 'POS Card Payment',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-21T14:10:00Z',
        amount: 1200,
        currency: 'USD',
        sender: 'Sarah Connor',
        receiver: 'Tech Equipment Store',
        sender_country: 'US',
        receiver_country: 'US',
        account_number: 'US1122334455',
        transaction_type: 'ACH Debit',
        customer_type: 'Individual'
      },
      {
        transaction_date: '2026-07-22T09:20:00Z',
        amount: 3200,
        currency: 'EUR',
        sender: 'Antoine Dubois',
        receiver: 'Sophie Laurent',
        sender_country: 'FR',
        receiver_country: 'FR',
        account_number: 'FR12345678',
        transaction_type: 'SEPA Direct',
        customer_type: 'Individual'
      }
    ]
  }
];

