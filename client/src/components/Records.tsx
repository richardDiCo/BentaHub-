import { useState, useMemo } from 'react';
import { FileText, TrendingUp, TrendingDown, Plus, Calendar, Banknote, QrCode, Receipt, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Transaction, Expense } from '@/lib/types';
import { expenseCategoryLabels } from '@/lib/types';

interface RecordsProps {
  transactions: Transaction[];
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

type DateFilter = 'today' | 'week' | 'month' | 'all';

export function Records({ transactions, expenses, onAddExpense, onDeleteExpense }: RecordsProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'others' as Expense['category'],
  });

  const getDateRange = (filter: DateFilter): Date => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    switch (filter) {
      case 'today':
        return now;
      case 'week':
        now.setDate(now.getDate() - 7);
        return now;
      case 'month':
        now.setDate(1);
        return now;
      case 'all':
        return new Date(0);
    }
  };

  const filteredTransactions = useMemo(() => {
    const startDate = getDateRange(dateFilter);
    return transactions
      .filter(t => new Date(t.timestamp) >= startDate)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, dateFilter]);

  const filteredExpenses = useMemo(() => {
    const startDate = getDateRange(dateFilter);
    return expenses
      .filter(e => new Date(e.date) >= startDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, dateFilter]);

  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalSales - totalExpenses;

  const handleAddExpense = () => {
    onAddExpense({
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount) || 0,
      category: expenseForm.category,
      date: new Date(),
    });
    setExpenseForm({ description: '', amount: '', category: 'others' });
    setIsExpenseDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fil-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-records-title">Mga Rekord</h1>
          <p className="text-muted-foreground">Tingnan ang mga benta at gastos</p>
        </div>
        <Button onClick={() => setIsExpenseDialogOpen(true)} variant="outline" data-testid="button-add-expense">
          <Plus className="mr-2 h-4 w-4" />
          Magdagdag ng Gastos
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['today', 'week', 'month', 'all'] as DateFilter[]).map(filter => (
          <Button
            key={filter}
            variant={dateFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateFilter(filter)}
            data-testid={`filter-${filter}`}
          >
            {filter === 'today' && 'Ngayon'}
            {filter === 'week' && 'Linggo'}
            {filter === 'month' && 'Buwan'}
            {filter === 'all' && 'Lahat'}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card data-testid="card-total-sales">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kabuuang Benta</CardTitle>
            <TrendingUp className="h-4 w-4 text-status-online" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-online" data-testid="text-total-sales">
              ₱{totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{filteredTransactions.length} transaksyon</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-expenses">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kabuuang Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-status-busy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-busy" data-testid="text-total-expenses">
              ₱{totalExpenses.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{filteredExpenses.length} gastos</p>
          </CardContent>
        </Card>

        <Card data-testid="card-net-income">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Netong Kita</CardTitle>
            <Banknote className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-status-online' : 'text-status-busy'}`} data-testid="text-net-income">
              ₱{netIncome.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">benta - gastos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales" data-testid="tab-sales">
            <Receipt className="mr-2 h-4 w-4" />
            Mga Benta
          </TabsTrigger>
          <TabsTrigger value="expenses" data-testid="tab-expenses">
            <FileText className="mr-2 h-4 w-4" />
            Mga Gastos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Receipt className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium">Walang transaksyon pa</p>
                <p className="text-sm text-muted-foreground">Mag-record ng benta sa "Bagong Benta"</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {filteredTransactions.map(tx => (
                  <Card key={tx.id} data-testid={`transaction-${tx.id}`}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">₱{tx.total.toFixed(2)}</span>
                          <Badge variant={tx.paymentMethod === 'cash' ? 'secondary' : 'default'}>
                            {tx.paymentMethod === 'cash' ? (
                              <><Banknote className="mr-1 h-3 w-3" /> Cash</>
                            ) : (
                              <><QrCode className="mr-1 h-3 w-3" /> QR</>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.items.length} item{tx.items.length > 1 ? 's' : ''} • {formatDate(tx.timestamp)}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {tx.items.slice(0, 3).map((item, i) => (
                            <Badge key={i} variant="outline">
                              {item.quantity}× {item.productName}
                            </Badge>
                          ))}
                          {tx.items.length > 3 && (
                            <Badge variant="outline">+{tx.items.length - 3} pa</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          {filteredExpenses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-lg font-medium">Walang gastos pa</p>
                <p className="text-sm text-muted-foreground">I-click ang "Magdagdag ng Gastos" para mag-record</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {filteredExpenses.map(expense => (
                  <Card key={expense.id} data-testid={`expense-${expense.id}`}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-status-busy">-₱{expense.amount.toFixed(2)}</span>
                          <Badge variant="secondary">
                            {expenseCategoryLabels[expense.category]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {expense.description} • {formatDate(expense.date)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteExpense(expense.id)}
                        data-testid={`button-delete-expense-${expense.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bagong Gastos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsyon</Label>
              <Input
                id="description"
                placeholder="hal. Kuryente, Delivery fee"
                value={expenseForm.description}
                onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                data-testid="input-expense-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Halaga (₱)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                data-testid="input-expense-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategorya</Label>
              <Select
                value={expenseForm.category}
                onValueChange={v => setExpenseForm({ ...expenseForm, category: v as Expense['category'] })}
              >
                <SelectTrigger data-testid="select-expense-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(expenseCategoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
              Kanselahin
            </Button>
            <Button
              onClick={handleAddExpense}
              disabled={!expenseForm.description || !expenseForm.amount}
              data-testid="button-save-expense"
            >
              I-save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
