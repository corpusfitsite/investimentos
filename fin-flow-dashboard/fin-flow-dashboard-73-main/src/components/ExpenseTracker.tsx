
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Receipt, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const categories = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Moradia',
  'Educação',
  'Vestuário',
  'Outros'
];

const initialExpenses: Expense[] = [];

export const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios.get(`https://19hninclm5j9.manus.space/expenses/${user.id}`)
        .then(response => {
          setExpenses(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar despesas:", error);
          toast.error("Erro ao carregar despesas.");
        });
    }
  }, [user]);
  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    description: '',
    amount: 0
  });

  const addExpense = () => {
    if (!newExpense.date || !newExpense.category || !newExpense.description || newExpense.amount <= 0) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    axios.post("https://19hninclm5j9.manus.space/expenses", {
      ...newExpense,
      user_id: user?.id
    })
      .then(response => {
        setExpenses([response.data, ...expenses]);
        setNewExpense({
          date: "",
          category: "",
          description: "",
          amount: 0
        });
        toast.success("Despesa adicionada com sucesso!");
      })
      .catch(error => {
        console.error("Erro ao adicionar despesa:", error);
        toast.error("Erro ao adicionar despesa.");
      });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { category, total, count: categoryExpenses.length };
  }).filter(item => item.total > 0);

  return (
    <div className="space-y-6">
      {/* Add New Expense */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Nova Despesa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expenseDate">Data</Label>
              <Input
                id="expenseDate"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="expenseCategory">Categoria</Label>
              <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expenseDescription">Descrição</Label>
              <Input
                id="expenseDescription"
                placeholder="Ex: Uber para casa, lanche no shopping..."
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="expenseAmount">Valor (R$)</Label>
              <Input
                id="expenseAmount"
                type="number"
                step="0.01"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={addExpense}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Despesa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Resumo Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total de Despesas</div>
              <div className="text-xs text-gray-500">{expenses.length} transações registradas</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expensesByCategory.map(item => (
                <div key={item.category} className="flex justify-between items-center">
                  <span className="text-sm">{item.category}</span>
                  <div className="text-right">
                    <div className="font-medium">R$ {item.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{item.count} item(s)</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Histórico de Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div key={expense.id} className={`p-3 rounded-lg border ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-600">{expense.category}</div>
                    <div className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">R$ {expense.amount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
