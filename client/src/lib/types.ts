export interface Product {
  id: string;
  name: string;
  category: 'snacks' | 'drinks' | 'load' | 'canned' | 'hygiene' | 'others';
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'cash' | 'qr';
  amountReceived?: number;
  change?: number;
  timestamp: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'delivery' | 'bills' | 'supplies' | 'others';
  date: Date;
}

export type CategoryLabel = {
  [key in Product['category']]: string;
};

export const categoryLabels: CategoryLabel = {
  snacks: 'Meryenda',
  drinks: 'Inumin',
  load: 'Load/E-wallet',
  canned: 'De Lata',
  hygiene: 'Panlinis',
  others: 'Iba Pa',
};

export const expenseCategoryLabels: { [key in Expense['category']]: string } = {
  delivery: 'Delivery',
  bills: 'Bayarin',
  supplies: 'Supplies',
  others: 'Iba Pa',
};
