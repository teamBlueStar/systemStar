import React from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { mockChartData, mockEvents, mockNotifications } from '@/data/mock';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Bell, AlertTriangle, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

export const DashboardPage = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Usuarios activos" value="24" />
        <StatCard title="Clientes" value="87" />
        <StatCard title="Dispositivos GPS" value="312" />
        <StatCard title="Vehículos conectados" value="198" />
        <StatCard title="Servidores" value="6" />
        <StatCard title="Alertas activas" value="3" badge="Crítico" dotColor="red" />
        <StatCard title="Estado del sistema" value="Operacional" dotColor="green" />
        <StatCard title="Proyectos activos" value="9" />
      </div>

      {/* Chart */}
      <div className="bg-card border border-card-border rounded-lg p-5">
        <h3 className="text-sm font-medium text-foreground mb-6">Actividad de dispositivos – últimos 7 días</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConexiones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAlertas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area type="monotone" dataKey="conexiones" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorConexiones)" />
              <Area type="monotone" dataKey="alertas" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorAlertas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Events */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Últimos eventos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hora</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.map((event) => (
                  <tr key={event.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{event.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        event.status === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                        event.status === 'warning' ? 'bg-warning/10 text-warning border border-warning/20' :
                        event.status === 'success' ? 'bg-success/10 text-success border border-success/20' :
                        'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground truncate max-w-[200px]" title={event.description}>{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-card-border rounded-lg flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-medium text-foreground">Notificaciones recientes</h3>
            <button className="text-xs text-primary hover:underline">Ver todas</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockNotifications.slice(0,5).map(notif => (
              <div key={notif.id} className="p-4 border-b border-border/50 flex gap-4 hover:bg-muted/10 transition-colors">
                <div className={`mt-0.5 rounded-full p-1.5 ${
                  notif.type === 'Alerta' ? 'bg-destructive/10 text-destructive' :
                  notif.type === 'Error' ? 'bg-warning/10 text-warning' :
                  notif.type === 'Evento' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {notif.type === 'Alerta' ? <AlertTriangle className="w-4 h-4" /> :
                   notif.type === 'Error' ? <Activity className="w-4 h-4" /> :
                   notif.type === 'Evento' ? <CheckCircle2 className="w-4 h-4" /> :
                   <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-foreground">{notif.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
