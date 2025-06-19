
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calculator } from "lucide-react";

interface MonthlyReturn {
  month: string;
  initialValue: number;
  returnRate: number;
  finalValue: number;
}

const initialData: MonthlyReturn[] = [
  { month: 'Agosto', initialValue: 0, returnRate: 0.7, finalValue: 400 },
  { month: 'Setembro', initialValue: 400, returnRate: 0.7, finalValue: 903 },
  { month: 'Outubro', initialValue: 903, returnRate: 0.7, finalValue: 1515 },
  { month: 'Novembro', initialValue: 1515, returnRate: 0.7, finalValue: 2226 },
  { month: 'Dezembro', initialValue: 2226, returnRate: 0.7, finalValue: 3048 }
];

export const InvestmentReturns = () => {
  const [returnRate, setReturnRate] = useState(0.7);
  const [monthlyContribution, setMonthlyContribution] = useState(450);
  const [simulationData, setSimulationData] = useState(initialData);

  const calculateSimulation = () => {
    const newData: MonthlyReturn[] = [];
    let currentValue = 0;

    const months = ['Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    months.forEach((month, index) => {
      const initialValue = currentValue;
      const contribution = index === 0 ? 400 : monthlyContribution; // First month different
      const valueWithContribution = currentValue + contribution;
      const returns = valueWithContribution * (returnRate / 100);
      const finalValue = valueWithContribution + returns;

      newData.push({
        month,
        initialValue,
        returnRate,
        finalValue: Math.round(finalValue)
      });

      currentValue = finalValue;
    });

    setSimulationData(newData);
  };

  const finalValue = simulationData[simulationData.length - 1]?.finalValue || 0;
  const totalContributed = simulationData.reduce((sum, item, index) => {
    return sum + (index === 0 ? 400 : monthlyContribution);
  }, 0);
  const totalReturns = finalValue - totalContributed;

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Simulador de Rendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="returnRate">Taxa de Rendimento Mensal (%)</Label>
              <Input
                id="returnRate"
                type="number"
                step="0.1"
                value={returnRate}
                onChange={(e) => setReturnRate(parseFloat(e.target.value) || 0)}
                onBlur={calculateSimulation}
              />
              <p className="text-xs text-gray-500 mt-1">Baseado no CDI médio (0,7% ao mês)</p>
            </div>
            <div>
              <Label htmlFor="monthlyContribution">Aporte Mensal (R$)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                onBlur={calculateSimulation}
              />
              <p className="text-xs text-gray-500 mt-1">Valor padrão de aporte mensal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">R$ {finalValue.toLocaleString('pt-BR')}</div>
            <div className="text-sm text-green-600">Valor Final</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">R$ {totalContributed.toLocaleString('pt-BR')}</div>
            <div className="text-sm text-blue-600">Total Investido</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">R$ {totalReturns.toLocaleString('pt-BR')}</div>
            <div className="text-sm text-purple-600">Rendimentos</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução dos Investimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={simulationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString('pt-BR')}`,
                  name === 'finalValue' ? 'Valor Final' : 'Valor Inicial'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="finalValue" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Mês</th>
                  <th className="text-right p-2">Valor Inicial</th>
                  <th className="text-right p-2">Rendimento (%)</th>
                  <th className="text-right p-2">Valor Final</th>
                  <th className="text-right p-2">Crescimento</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((item, index) => {
                  const growth = index > 0 ? item.finalValue - simulationData[index - 1].finalValue : item.finalValue;
                  return (
                    <tr key={item.month} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-2 font-medium">{item.month}</td>
                      <td className="text-right p-2">R$ {item.initialValue.toLocaleString('pt-BR')}</td>
                      <td className="text-right p-2">{item.returnRate}%</td>
                      <td className="text-right p-2 font-bold text-green-600">R$ {item.finalValue.toLocaleString('pt-BR')}</td>
                      <td className="text-right p-2 text-blue-600">+R$ {growth.toLocaleString('pt-BR')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
