import React, { useState } from 'react';
import { Calendar, FileDown, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('dispositivos');

  const exportPDF = () => {
    toast.info('Generando PDF...');
    setTimeout(() => toast.success('Reporte exportado correctamente'), 1500);
  };

  const chartData = [
    { name: 'Sem 1', dispositivos: 280, incidentes: 45 },
    { name: 'Sem 2', dispositivos: 290, incidentes: 30 },
    { name: 'Sem 3', dispositivos: 305, incidentes: 55 },
    { name: 'Sem 4', dispositivos: 312, incidentes: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-card-border p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-input/50 border border-border rounded-md px-3 py-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input type="date" className="bg-transparent text-sm focus:outline-none text-foreground" defaultValue="2024-01-01" />
            <span className="text-muted-foreground">-</span>
            <input type="date" className="bg-transparent text-sm focus:outline-none text-foreground" defaultValue="2024-01-31" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={exportPDF} className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md text-sm transition-colors border border-border">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm transition-colors">
            <FileDown className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border">
        {['dispositivos', 'vehiculos', 'clientes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-medium mb-6">Tendencia Mensual</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Area type="monotone" dataKey="dispositivos" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                <Area type="monotone" dataKey="incidentes" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-5">
          <h3 className="text-sm font-medium mb-4">Resumen</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded border border-border/50">
              <span className="text-sm text-muted-foreground">Total {activeTab}</span>
              <span className="font-mono font-semibold text-foreground">312</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded border border-border/50">
              <span className="text-sm text-muted-foreground">Activos</span>
              <span className="font-mono font-semibold text-success">298</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded border border-border/50">
              <span className="text-sm text-muted-foreground">Con incidentes</span>
              <span className="font-mono font-semibold text-warning">14</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded border border-border/50">
              <span className="text-sm text-muted-foreground">Crecimiento (MoM)</span>
              <span className="font-mono font-semibold text-primary">+12.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
