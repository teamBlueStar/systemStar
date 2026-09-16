import React from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { mockServers } from '@/data/mock';
import { Server, Cpu, HardDrive } from 'lucide-react';

export const SystemStarPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Server className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">systemStar</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
              Operacional
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Gestión centralizada de infraestructura de servidores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Servidores activos" value="5" icon={Server} />
        <StatCard title="Conexiones/sec" value="4,250" trend="+12%" trendUp={true} />
        <StatCard title="Latencia media" value="42ms" dotColor="green" />
        <StatCard title="Versión" value="v1.8.0" />
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden mt-6">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-medium">Nodos de Servidor</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID Nodo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Región</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">CPU / RAM</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {mockServers.map(server => (
                <tr key={server.id} className="border-b border-border/50 hover:bg-muted/10">
                  <td className="px-4 py-3">
                    <div className="font-medium">{server.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{server.ip}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-muted rounded text-xs">{server.region}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-xs">
                        <Cpu className="w-3 h-3 text-muted-foreground" /> {server.cpuUsage}%
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <HardDrive className="w-3 h-3 text-muted-foreground" /> {server.ramUsage}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                      server.status === 'Operacional' ? 'bg-success/10 text-success border-success/20' :
                      server.status === 'Alerta' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      {server.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{server.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
