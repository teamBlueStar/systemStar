import React from 'react';
import { mockServers } from '@/data/mock';
import { Server, Cpu, HardDrive, Network, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const ServersPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockServers.map(server => (
          <div key={server.id} className="bg-card border border-card-border rounded-lg p-5 flex flex-col group hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Server className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{server.name}</h3>
                  <div className="text-xs font-mono text-muted-foreground">{server.ip}</div>
                </div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                server.status === 'Operacional' ? 'bg-success shadow-success/50' :
                server.status === 'Alerta' ? 'bg-warning shadow-warning/50' : 'bg-destructive shadow-destructive/50'
              }`} title={server.status} />
            </div>

            <div className="space-y-4 my-4 flex-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU</span>
                  <span className="font-mono">{server.cpuUsage}%</span>
                </div>
                <Progress value={server.cpuUsage} className={`h-1.5 ${server.cpuUsage > 80 ? 'bg-destructive/20 [&>div]:bg-destructive' : ''}`} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1"><HardDrive className="w-3 h-3" /> RAM</span>
                  <span className="font-mono">{server.ramUsage}%</span>
                </div>
                <Progress value={server.ramUsage} className={`h-1.5 ${server.ramUsage > 85 ? 'bg-destructive/20 [&>div]:bg-destructive' : ''}`} />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Network className="w-3.5 h-3.5" /> {server.region}</span>
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Up: {server.uptime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
