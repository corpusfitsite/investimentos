
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ProjectionEntry {
  id: string;
  date: string;
  income: number;
  freeInvestment: number;
  fixedIncome: number;
  personalUse: number;
  surplus: number;
  accumulatedInvestments: number;
  accumulatedPC: number;
}

const initialData: ProjectionEntry[] = [
  {
    id: '1',
    date: '2024-08-15',
    income: 901.52,
    freeInvestment: 400,
    fixedIncome: 300,
    personalUse: 150,
    surplus: 51.52,
    accumulatedInvestments: 400,
    accumulatedPC: 100
  },
  {
    id: '2',
    date: '2024-08-30',
    income: 1100.00,
    freeInvestment: 500,
    fixedIncome: 350,
    personalUse: 200,
    surplus: 50,
    accumulatedInvestments: 900,
    accumulatedPC: 225
  },
  {
    id: '3',
    date: '2024-09-15',
    income: 901.52,
    freeInvestment: 400,
    fixedIncome: 300,
    personalUse: 150,
    surplus: 51.52,
    accumulatedInvestments: 1300,
    accumulatedPC: 325
  }
];

export const FinancialProjection = () => {
  const [entries, setEntries] = useState<ProjectionEntry[]>(initialData);
  const [newEntry, setNewEntry] = useState({
    date: '',
    income: 0,
    freeInvestment: 0,
    fixedIncome: 0,
    personalUse: 0,
    surplus: 0
  });

  const addEntry = () => {
    if (!newEntry.date || newEntry.income <= 0) {
      toast.error("Preencha a data e o valor de recebimento");
      return;
    }

    const lastEntry = entries[entries.length - 1];
    const accumulatedInvestments = lastEntry ? lastEntry.accumulatedInvestments + newEntry.freeInvestment : newEntry.freeInvestment;
    const accumulatedPC = lastEntry ? lastEntry.accumulatedPC + (newEntry.freeInvestment * 0.25) : newEntry.freeInvestment * 0.25;

    const entry: ProjectionEntry = {
      id: Date.now().toString(),
      ...newEntry,
      accumulatedInvestments,
      accumulatedPC
    };

    setEntries([...entries, entry]);
    setNewEntry({
      date: '',
      income: 0,
      freeInvestment: 0,
      fixedIncome: 0,
      personalUse: 0,
      surplus: 0
    });
    
    toast.success("Entrada adicionada com sucesso!");
  };

  const totalAllocated = newEntry.freeInvestment + newEntry.fixedIncome + newEntry.personalUse + newEntry.surplus;
  const remaining = newEntry.income - totalAllocated;

  return (
    <div className="space-y-6">
      {/* Add New Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Entrada Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="income">Recebimento (R$)</Label>
              <Input
                id="income"
                type="number"
                step="0.01"
                value={newEntry.income || ''}
                onChange={(e) => setNewEntry({...newEntry, income: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="freeInvestment">Investimento Livre (R$)</Label>
              <Input
                id="freeInvestment"
                type="number"
                step="0.01"
                value={newEntry.freeInvestment || ''}
                onChange={(e) => setNewEntry({...newEntry, freeInvestment: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="fixedIncome">Renda Fixa C6 (R$)</Label>
              <Input
                id="fixedIncome"
                type="number"
                step="0.01"
                value={newEntry.fixedIncome || ''}
                onChange={(e) => setNewEntry({...newEntry, fixedIncome: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="personalUse">Uso Pessoal (R$)</Label>
              <Input
                id="personalUse"
                type="number"
                step="0.01"
                value={newEntry.personalUse || ''}
                onChange={(e) => setNewEntry({...newEntry, personalUse: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="surplus">Sobra (R$)</Label>
              <Input
                id="surplus"
                type="number"
                step="0.01"
                value={newEntry.surplus || ''}
                onChange={(e) => setNewEntry({...newEntry, surplus: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className={`text-sm ${remaining === 0 ? 'text-green-600' : remaining < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
              Restante: R$ {remaining.toFixed(2)}
              {remaining !== 0 && (
                <span className="ml-2">
                  {remaining > 0 ? '(Não alocado)' : '(Excesso de alocação)'}
                </span>
              )}
            </div>
            <Button onClick={addEntry} disabled={newEntry.income <= 0}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Entrada
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Projeções Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Data</th>
                  <th className="text-right p-2">Recebimento</th>
                  <th className="text-right p-2">Inv. Livre</th>
                  <th className="text-right p-2">Renda Fixa</th>
                  <th className="text-right p-2">Uso Pessoal</th>
                  <th className="text-right p-2">Sobra</th>
                  <th className="text-right p-2">Acum. Inv.</th>
                  <th className="text-right p-2">Acum. PC</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                    <td className="text-right p-2 font-medium">R$ {entry.income.toFixed(2)}</td>
                    <td className="text-right p-2 text-green-600">R$ {entry.freeInvestment.toFixed(2)}</td>
                    <td className="text-right p-2 text-blue-600">R$ {entry.fixedIncome.toFixed(2)}</td>
                    <td className="text-right p-2 text-yellow-600">R$ {entry.personalUse.toFixed(2)}</td>
                    <td className="text-right p-2 text-gray-600">R$ {entry.surplus.toFixed(2)}</td>
                    <td className="text-right p-2 font-bold text-green-700">R$ {entry.accumulatedInvestments.toFixed(2)}</td>
                    <td className="text-right p-2 font-bold text-blue-700">R$ {entry.accumulatedPC.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
