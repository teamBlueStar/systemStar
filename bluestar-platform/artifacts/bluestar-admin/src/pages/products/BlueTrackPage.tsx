import React from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { mockDevices } from '@/data/mock';
import { CheckCircle2, Activity, RadioReceiver } from 'lucide-react';

export const BlueTrackPage = () => {
  const activeCount = mockDevices.filter(d => d.status === 'Activo').length;
  const errorCount = mockDevices.filter(d => d.status === 'Error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <RadioReceiver className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">BlueTrack</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
              Servicio Activo
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Plataforma de rastreo y telemetría GPS de alta precisión.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Dispositivos activos" value={activeCount} icon={CheckCircle2} colorClass="border-primary/20" />
        <StatCard title="Dispositivos en error" value={errorCount} dotColor="red" />
        <StatCard title="Uptime mensual" value="99.98%" trend="+0.01%" trendUp={true} />
        <StatCard title="Versión firmware" value="v2.4.1-stable" badge="Latest" />
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden mt-6">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-medium">Instalaciones recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">IMEI</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Modelo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Última conexión</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockDevices.slice(0,8).map(device => (
                <tr key={device.id} className="border-b border-border/50 hover:bg-muted/10">
                  <td className="px-4 py-3 font-mono text-xs">{device.imei}</td>
                  <td className="px-4 py-3">{device.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{device.lastConnection}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${device.status === 'Activo' ? 'bg-success' : device.status === 'Error' ? 'bg-destructive' : 'bg-muted-foreground'}`} />
                      <span>{device.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
