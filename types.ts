
export type AssetType = 'BTC' | 'ETH' | 'SOL' | 'USDC' | 'ZAR' | 'CURR';

export interface User {
  id: string;
  email: string;
  name: string;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'business_verified';
  internalWallet: string;
}

export interface Bank {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface Transaction {
  id: string;
  asset: AssetType;
  type: 'Bridge Out' | 'Bridge In' | 'Swap' | 'Card Payment' | 'Deposit' | 'Bill Payment' | 'Internal Transfer' | 'External Transfer';
  amountCrypto?: number;
  amountZar: number;
  status: 'Settled' | 'Processing' | 'Failed';
  timestamp: string;
  txHash: string;
  merchant?: string;
  recipientAccount?: string;
  recipientBank?: string;
}

export interface PricePoint {
  time: string;
  price: number;
}

export interface AssetBalance {
  id: string;
  name: string;
  symbol: AssetType;
  balance: number;
  valueZar: number;
  change24h: number;
  color: string;
}

export interface VirtualCard {
  id: string;
  last4: string;
  expiry: string;
  type: 'Virtual' | 'Physical';
  status: 'Active' | 'Frozen';
  balanceZar: number;
  color: 'cyan' | 'green' | 'midnight';
}

export interface Biller {
  id: string;
  name: string;
  category: 'Utilities' | 'Media' | 'Retail' | 'Education';
  icon: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type PaymentCategory = 'bills' | 'send';
export type TransferType = 'internal' | 'external';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly';

export interface SavedPayee {
  id: string;
  label: string;
  accountNumber: string;
  type: PaymentCategory;
  transferType?: TransferType;
  billerId?: string;
  bankId?: string;
  recipientName?: string;
}

export interface RecurringPayment {
  id: string;
  label: string;
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  nextDate: string;
  payeeId?: string;
  billerId?: string;
  type: PaymentCategory;
}
