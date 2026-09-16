import React from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { Gamepad2, Users, Swords } from 'lucide-react';

export const AldratharPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Gamepad2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Aldrathar</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
              Online
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Métricas y administración del servidor de juego.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Jugadores concurrentes" value="1,245" icon={Users} colorClass="border-primary/20" />
        <StatCard title="Partidas activas" value="184" icon={Swords} />
        <StatCard title="Carga del servidor" value="45%" dotColor="green" />
        <StatCard title="Última actualización" value="Hace 2 días" />
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden mt-6">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-medium">Registro de eventos recientes</h3>
        </div>
        <div className="p-4 space-y-3 font-mono text-xs">
          <div className="flex gap-4 p-2 bg-muted/20 rounded">
            <span className="text-muted-foreground w-20">10:45:02</span>
            <span className="text-success">[SESSION]</span>
            <span className="text-foreground">Player 'DragonSlayer' connected (Region: EU)</span>
          </div>
          <div className="flex gap-4 p-2 bg-muted/20 rounded">
            <span className="text-muted-foreground w-20">10:44:15</span>
            <span className="text-primary">[MATCH]</span>
            <span className="text-foreground">Match #88942 started (Arena: Frostfire)</span>
          </div>
          <div className="flex gap-4 p-2 bg-muted/20 rounded">
            <span className="text-muted-foreground w-20">10:42:50</span>
            <span className="text-warning">[WARNING]</span>
            <span className="text-foreground">High latency detected for Player 'NoobMaster' (450ms)</span>
          </div>
          <div className="flex gap-4 p-2 bg-muted/20 rounded">
            <span className="text-muted-foreground w-20">10:40:01</span>
            <span className="text-destructive">[ERROR]</span>
            <span className="text-foreground">Failed to save inventory state for Player 'Alex'</span>
          </div>
          <div className="flex gap-4 p-2 bg-muted/20 rounded">
            <span className="text-muted-foreground w-20">10:35:22</span>
            <span className="text-success">[SESSION]</span>
            <span className="text-foreground">Player 'Alex' disconnected cleanly</span>
          </div>
        </div>
      </div>
    </div>
  );
};
