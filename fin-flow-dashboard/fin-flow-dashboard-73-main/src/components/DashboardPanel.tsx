
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

const pieData = [
  { name: 'Investimento Livre', value: 400, color: '#10B981' },
  { name: 'Renda Fixa (C6)', value: 300, color: '#3B82F6' },
  { name: 'Uso Pessoal', value: 250, color: '#F59E0B' },
  { name: 'Sobra', value: 150, color: '#EF4444' }
];

const progressData = [
  { month: 'Ago', accumulated: 800 },
  { month: 'Set', accumulated: 1650 },
  { month: 'Out', accumulated: 2550 },
  { month: 'Nov', accumulated: 3500 },
  { month: 'Dez', accumulated: 4500 }
];

export const DashboardPanel = () => {
  const totalAccumulated = 3500;
  const target = 3000;
  const progressPercentage = (totalAccumulated / target) * 100;
  const isOnTrack = totalAccumulated >= target;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Card */}
      <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnTrack ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
            Status Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                R$ {totalAccumulated.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">Acumulado em Investimentos</div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isOnTrack ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-semibold ${
                isOnTrack ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {isOnTrack ? '🎯 Meta Alcançada!' : '📈 No Caminho Certo'}
              </div>
              <div className="text-sm text-gray-600">
                Meta: R$ {target.toLocaleString('pt-BR')} | {progressPercentage.toFixed(1)}% concluído
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Distribuição Atual (Nov/24)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: R$${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`R$ ${value}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução dos Investimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value}`, 'Acumulado']} />
              <Bar dataKey="accumulated" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PC Upgrade Fund */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            💻 Fundo PC Upgrade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-600">R$ 1.250</div>
            <div className="text-sm text-gray-600">Reservado para upgrades</div>
            <div className="bg-blue-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full w-3/5 transition-all duration-500" />
            </div>
            <div className="text-xs text-gray-500">60% da meta de R$ 2.000</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
