import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart as PieChartIcon } from "lucide-react";

interface FinanceChartProps {
  data: any[];
  type?: "area" | "pie";
}

const areaData = [
  { month: "Jan", entradas: 15000, saidas: 8000 },
  { month: "Fev", entradas: 18000, saidas: 12000 },
  { month: "Mar", entradas: 22000, saidas: 9000 },
  { month: "Abr", entradas: 25000, saidas: 11000 },
  { month: "Mai", entradas: 28000, saidas: 13000 },
  { month: "Jun", entradas: 32000, saidas: 15000 },
];

const pieData = [
  { name: "Receitas", value: 65, color: "#10b981" },
  { name: "Despesas", value: 35, color: "#ef4444" },
];

export function FinanceChart({ data, type: initialType = "area" }: FinanceChartProps) {
  const [chartType, setChartType] = useState<"area" | "pie">(initialType);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border/20">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="finance-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Análise Financeira</h3>
        <div className="flex gap-2">
          <Button
            variant={chartType === "area" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("area")}
            className="gap-2"
          >
            <BarChart className="w-4 h-4" />
            Evolução
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("pie")}
            className="gap-2"
          >
            <PieChartIcon className="w-4 h-4" />
            Distribuição
          </Button>
        </div>
      </div>

      <div className="h-80 w-full">
        {chartType === "area" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis 
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorEntradas)"
                strokeWidth={2}
                name="Entradas"
              />
              <Area
                type="monotone"
                dataKey="saidas"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorSaidas)"
                strokeWidth={2}
                name="Saídas"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Percentual"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))"
                }}
              />
              <Legend
                wrapperStyle={{ color: "hsl(var(--foreground))" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}