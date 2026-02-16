
import { Bank, Transaction, PricePoint, AssetBalance, VirtualCard, Biller } from './types';

export const BANKS: Bank[] = [
  { id: 'absa', name: 'Absa', logo: 'A', color: '#BF0000' },
  { id: 'fnb', name: 'FNB', logo: 'F', color: '#00A19D' },
  { id: 'standard', name: 'Standard Bank', logo: 'S', color: '#0033A1' },
  { id: 'capitec', name: 'Capitec', logo: 'C', color: '#003F69' },
  { id: 'nedbank', name: 'Nedbank', logo: 'N', color: '#00703C' },
];

export const BILLERS: Biller[] = [
  { id: 'dstv', name: 'DStv', category: 'Media', icon: '📺' },
  { id: 'elec', name: 'Prepaid Electricity', category: 'Utilities', icon: '⚡' },
  { id: 'homechoice', name: 'HomeChoice', category: 'Retail', icon: '🏠' },
  { id: 'telkom', name: 'Telkom', category: 'Utilities', icon: '📞' },
  { id: 'unisa', name: 'UNISA', category: 'Education', icon: '🎓' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    asset: 'ETH',
    type: 'Bridge Out',
    amountCrypto: 1.25,
    amountZar: 65562.50,
    status: 'Settled',
    timestamp: '2024-05-20 14:23',
    txHash: '0x74...f2e'
  },
  {
    id: '2',
    asset: 'BTC',
    type: 'Bridge Out',
    amountCrypto: 0.045,
    amountZar: 52140.00,
    status: 'Processing',
    timestamp: '2024-05-20 16:45',
    txHash: 'bc1q...9u3'
  },
  {
    id: 'c-1',
    asset: 'CURR',
    type: 'Swap',
    amountCrypto: 1250,
    amountZar: 25000.00,
    status: 'Settled',
    timestamp: '2024-05-20 18:10',
    txHash: '0xcurr...99'
  }
];

export const ASSET_BALANCES: AssetBalance[] = [
  { id: 'curr-tok', name: 'Current Protocol', symbol: 'CURR', balance: 4500.00, valueZar: 90000.00, change24h: 18.5, color: '#FF00E5' },
  { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 4.25, valueZar: 222912.50, change24h: 4.2, color: '#00F0FF' },
  { id: '2', name: 'Bitcoin', symbol: 'BTC', balance: 0.082, valueZar: 95120.00, change24h: -1.2, color: '#F7931A' },
  { id: '3', name: 'Solana', symbol: 'SOL', balance: 145.5, valueZar: 41467.50, change24h: 12.5, color: '#39FF14' },
  { id: '4', name: 'USDC', symbol: 'USDC', balance: 2450.00, valueZar: 46182.50, change24h: 0.05, color: '#2775CA' },
  { id: '5', name: 'SA Rand', symbol: 'ZAR', balance: 12450.00, valueZar: 12450.00, change24h: 0, color: '#FFFFFF' },
];

export const VIRTUAL_CARDS: VirtualCard[] = [
  { id: 'c1', last4: '8842', expiry: '08/27', type: 'Virtual', status: 'Active', balanceZar: 5000, color: 'cyan' },
  { id: 'c2', last4: '1109', expiry: '12/26', type: 'Physical', status: 'Active', balanceZar: 12450, color: 'midnight' },
  { id: 'c3', last4: '4421', expiry: '01/25', type: 'Virtual', status: 'Frozen', balanceZar: 0, color: 'green' },
];

export const MOCK_CHART_DATA: PricePoint[] = [
  { time: '00:00', price: 51200 },
  { time: '04:00', price: 51800 },
  { time: '08:00', price: 52450 },
  { time: '12:00', price: 52100 },
  { time: '16:00', price: 52900 },
  { time: '20:00', price: 52450 },
  { time: '23:59', price: 52450 },
];
