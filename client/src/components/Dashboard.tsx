import { TrendingUp, ShoppingBag, AlertTriangle, Banknote, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product, Transaction, Expense } from '@/lib/types';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  expenses: Expense[];
  onNavigateToInventory?: () => void;
}

export function Dashboard({ products, transactions, expenses, onNavigateToInventory }: DashboardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTransactions = transactions.filter(t => {
    const txDate = new Date(t.timestamp);
    txDate.setHours(0, 0, 0, 0);
    return txDate.getTime() === today.getTime();
  });

  const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const todayTransactionCount = todayTransactions.length;

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const monthlyExpenses = expenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate >= thisMonth;
  }).reduce((sum, e) => sum + e.amount, 0);

  const monthlyTransactions = transactions.filter(t => {
    const txDate = new Date(t.timestamp);
    return txDate >= thisMonth;
  });
  const monthlySales = monthlyTransactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-6 p-4 pb-24 md:pb-4">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Magandang Araw!</h1>
        <p className="text-muted-foreground">Narito ang summary ng iyong tindahan ngayon.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-today-sales">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Benta Ngayon</CardTitle>
            <Banknote className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary" data-testid="text-today-sales">
              ₱{todaySales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-status-online" />
              Kahapon: ₱0.00
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-transactions">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mga Transaksyon</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-transaction-count">
              {todayTransactionCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              transaksyon ngayong araw
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-low-stock">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${lowStockProducts.length > 0 ? 'text-status-away' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${lowStockProducts.length > 0 ? 'text-status-away' : ''}`} data-testid="text-low-stock-count">
              {lowStockProducts.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              produkto na kailangan ng restock
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-monthly-profit">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Netong Benta (Buwan)</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-monthly-net">
              ₱{(monthlySales - monthlyExpenses).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-status-busy" />
              Gastos: ₱{monthlyExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-status-away" />
              Mga Produktong Mababa ang Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-md border p-3"
                  data-testid={`low-stock-item-${product.id}`}
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">₱{product.price.toFixed(2)}</p>
                  </div>
                  <Badge variant="outline" className="bg-status-away/10 text-status-away border-status-away/30">
                    {product.stock} natitira
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <button
                  onClick={onNavigateToInventory}
                  className="w-full text-center text-sm text-primary hover:underline"
                  data-testid="link-view-all-low-stock"
                >
                  Tingnan lahat ({lowStockProducts.length} produkto)
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {todayTransactions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mga Huling Transaksyon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayTransactions.slice(0, 5).map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-md border p-3"
                  data-testid={`recent-tx-${tx.id}`}
                >
                  <div>
                    <p className="font-medium">₱{tx.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.items.length} item{tx.items.length > 1 ? 's' : ''} • {new Date(tx.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Badge variant={tx.paymentMethod === 'cash' ? 'secondary' : 'default'}>
                    {tx.paymentMethod === 'cash' ? 'Cash' : 'QR'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {todayTransactions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">Walang transaksyon pa ngayon</p>
            <p className="text-sm text-muted-foreground">I-click ang "Bagong Benta" para magsimula!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
