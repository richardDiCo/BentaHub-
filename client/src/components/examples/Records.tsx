import { useState } from 'react';
import { Records } from '../Records';
import type { Transaction, Expense } from '@/lib/types';

// todo: remove mock functionality
const mockTransactions: Transaction[] = [
  {
    id: 't1',
    items: [
      { productId: '1', productName: 'Coca-Cola 1.5L', quantity: 2, price: 65 },
      { productId: '2', productName: 'Lucky Me Pancit Canton', quantity: 3, price: 14 },
    ],
    total: 172,
    paymentMethod: 'cash',
    amountReceived: 200,
    change: 28,
    timestamp: new Date(),
  },
  {
    id: 't2',
    items: [
      { productId: '5', productName: 'Smart Load ₱50', quantity: 1, price: 50 },
    ],
    total: 50,
    paymentMethod: 'qr',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 't3',
    items: [
      { productId: '3', productName: 'Surf Powder 45g', quantity: 5, price: 8 },
      { productId: '4', productName: 'Argentina Corned Beef 150g', quantity: 2, price: 42 },
    ],
    total: 124,
    paymentMethod: 'cash',
    amountReceived: 150,
    change: 26,
    timestamp: new Date(Date.now() - 7200000),
  },
];

// todo: remove mock functionality
const mockExpenses: Expense[] = [
  { id: 'e1', description: 'Kuryente', amount: 1500, category: 'bills', date: new Date() },
  { id: 'e2', description: 'Delivery ng supplies', amount: 200, category: 'delivery', date: new Date(Date.now() - 86400000) },
  { id: 'e3', description: 'Plastic bags', amount: 50, category: 'supplies', date: new Date(Date.now() - 172800000) },
];

export default function RecordsExample() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    console.log('Expense added:', newExpense);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    console.log('Expense deleted:', id);
  };

  return (
    <Records
      transactions={mockTransactions}
      expenses={expenses}
      onAddExpense={handleAddExpense}
      onDeleteExpense={handleDeleteExpense}
    />
  );
}
