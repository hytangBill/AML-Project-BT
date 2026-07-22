import { RawTransactionRecord } from '../types';

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  data: RawTransactionRecord[];
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'structuring-syndicate',
    name: 'Structuring & Smurfing Syndicate Dataset',
    description: '15 transaction records featuring structured cash deposits under $10,000, rapid velocity layering, and multi-account smurfing.',
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
        transaction_date: '2026-07-20T16:00:00Z',
        amount: 145000,
        currency: 'EUR',
        sender: 'Victor Vance',
        receiver: 'Syrian Energy Trading Co',
        sender_country: 'DE',
        receiver_country: 'SY',
        account_number: 'DE44100200300987654321',
        transaction_type: 'Wire Transfer',
        customer_type: 'PEP - Minister'
      },
      {
        transaction_date: '2026-07-21T08:20:00Z',
        amount: 9900,
        currency: 'USD',
        sender: 'BlueSky Holding Inc',
        receiver: 'Oceanic Nominees',
        sender_country: 'US',
        receiver_country: 'KY',
        account_number: 'US9933001122',
        transaction_type: 'SWIFT Wire',
        customer_type: 'Offshore Shell Entity'
      },
      {
        transaction_date: '2026-07-21T09:00:00Z',
        amount: 9850,
        currency: 'USD',
        sender: 'BlueSky Holding Inc',
        receiver: 'Oceanic Nominees',
        sender_country: 'US',
        receiver_country: 'KY',
        account_number: 'US9933001122',
        transaction_type: 'SWIFT Wire',
        customer_type: 'Offshore Shell Entity'
      },
      {
        transaction_date: '2026-07-21T09:40:00Z',
        amount: 9920,
        currency: 'USD',
        sender: 'BlueSky Holding Inc',
        receiver: 'Oceanic Nominees',
        sender_country: 'US',
        receiver_country: 'KY',
        account_number: 'US9933001122',
        transaction_type: 'SWIFT Wire',
        customer_type: 'Offshore Shell Entity'
      },
      {
        transaction_date: '2026-07-21T10:15:00Z',
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
        transaction_date: '2026-07-21T13:10:00Z',
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
        transaction_date: '2026-07-21T15:30:00Z',
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
        transaction_date: '2026-07-22T08:00:00Z',
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
        transaction_date: '2026-07-22T09:20:00Z',
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
        transaction_date: '2026-07-22T10:05:00Z',
        amount: 89000,
        currency: 'EUR',
        sender: 'Tehran Petrochemical Exporters',
        receiver: 'Balkan Trade Agency',
        sender_country: 'IR',
        receiver_country: 'BY',
        account_number: 'IR1000998877',
        transaction_type: 'Crypto Asset Transfer',
        customer_type: 'High Risk Entity'
      },
      {
        transaction_date: '2026-07-22T11:45:00Z',
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
      }
    ]
  },
  {
    id: 'sanctions-pep',
    name: 'Sanctions & PEP Escalations Dataset',
    description: 'High-risk PEP transfers, sanctioned jurisdiction corridors, and sudden velocity spikes across international accounts.',
    data: [
      {
        transaction_date: '2026-07-20T10:00:00Z',
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
        transaction_date: '2026-07-20T14:20:00Z',
        amount: 500000,
        currency: 'EUR',
        sender: 'Minsk Mining Enterprise',
        receiver: 'Geneva Private Vaults',
        sender_country: 'BY',
        receiver_country: 'CH',
        account_number: 'BY1122334455',
        transaction_type: 'SWIFT Wire',
        customer_type: 'State-Owned Entity'
      },
      {
        transaction_date: '2026-07-21T11:10:00Z',
        amount: 85000,
        currency: 'USD',
        sender: 'Damascus Import Export',
        receiver: 'Kyiv Transit Solutions',
        sender_country: 'SY',
        receiver_country: 'UA',
        account_number: 'SY44332211',
        transaction_type: 'Trade Finance Transfer',
        customer_type: 'High Risk Sanctions Entity'
      },
      {
        transaction_date: '2026-07-22T08:30:00Z',
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
