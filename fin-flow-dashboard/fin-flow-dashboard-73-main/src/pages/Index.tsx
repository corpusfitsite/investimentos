
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/components/DashboardPanel";
import { FinancialProjection } from "@/components/FinancialProjection";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { InvestmentReturns } from "@/components/InvestmentReturns";
import { TrendingUp, Calculator, Receipt, PieChart, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              💰 Controle Financeiro Pessoal
            </h1>
            <p className="text-gray-600">
              Gerencie suas finanças, investimentos e metas de forma inteligente
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user?.username}!</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Painel de Controle
            </TabsTrigger>
            <TabsTrigger value="projection" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Projeção Financeira
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Despesas Mensais
            </TabsTrigger>
            <TabsTrigger value="investments" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Rendimentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardPanel />
          </TabsContent>

          <TabsContent value="projection">
            <FinancialProjection />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="investments">
            <InvestmentReturns />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
