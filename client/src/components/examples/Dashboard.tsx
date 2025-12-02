import { Dashboard } from '../Dashboard';
import type { Product, Transaction, Expense } from '@/lib/types';

// todo: remove mock functionality
const mockProducts: Product[] = [
  { id: '1', name: 'Coca-Cola 1.5L', category: 'drinks', price: 65, stock: 3, lowStockThreshold: 5 },
  { id: '2', name: 'Lucky Me Pancit Canton', category: 'snacks', price: 14, stock: 2, lowStockThreshold: 10 },
  { id: '3', name: 'Surf Powder 45g', category: 'hygiene', price: 8, stock: 50, lowStockThreshold: 20 },
  { id: '4', name: 'Argentina Corned Beef 150g', category: 'canned', price: 42, stock: 1, lowStockThreshold: 5 },
];

// todo: remove mock functionality
const mockTransactions: Transaction[] = [
  {
    id: 't1',
    items: [{ productId: '1', productName: 'Coca-Cola 1.5L', quantity: 2, price: 65 }],
    total: 130,
    paymentMethod: 'cash',
    amountReceived: 150,
    change: 20,
    timestamp: new Date(),
  },
  {
    id: 't2',
    items: [
      { productId: '2', productName: 'Lucky Me Pancit Canton', quantity: 5, price: 14 },
      { productId: '3', productName: 'Surf Powder 45g', quantity: 2, price: 8 },
    ],
    total: 86,
    paymentMethod: 'qr',
    timestamp: new Date(),
  },
];

// todo: remove mock functionality
const mockExpenses: Expense[] = [
  { id: 'e1', description: 'Kuryente', amount: 1500, category: 'bills', date: new Date() },
  { id: 'e2', description: 'Delivery ng supplies', amount: 200, category: 'delivery', date: new Date() },
];

export default function DashboardExample() {
  return (
    <Dashboard
      products={mockProducts}
      transactions={mockTransactions}
      expenses={mockExpenses}
      onNavigateToInventory={() => console.log('Navigate to inventory')}
    />
  );
}
