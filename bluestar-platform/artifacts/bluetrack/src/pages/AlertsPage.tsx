import { useState } from 'react';
import { useAppStore } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AlertsPage() {
  const { alerts, markAsRead, markAllAsRead } = useAppStore();
  const [filter, setFilter] = useState('Todas');

  const tabs = ['Todas', 'Velocidad', 'Motor', 'GPS', 'Batería', 'SOS', 'Geocercas'];

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'Todas') return true;
    if (filter === 'Velocidad') return a.type === 'speeding';
    if (filter === 'Motor') return a.type === 'engine_on' || a.type === 'engine_off';
    if (filter === 'GPS') return a.type === 'gps_lost';
    if (filter === 'Batería') return a.type === 'low_battery';
    if (filter === 'SOS') return a.type === 'sos';
    if (filter === 'Geocercas') return a.type === 'geofence_in' || a.type === 'geofence_out';
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Centro de Alertas
          {alerts.filter(a => !a.read).length > 0 && (
            <Badge variant="destructive" className="ml-2 font-mono">{alerts.filter(a => !a.read).length}</Badge>
          )}
        </h1>
        <Button variant="outline" onClick={markAllAsRead} disabled={alerts.every(a => a.read)}>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar todas como leídas
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="bg-muted border border-border h-auto flex-wrap justify-start">
          {tabs.map(t => (
            <TabsTrigger key={t} value={t} className="data-[state=active]:bg-card data-[state=active]:text-primary">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 w-12 text-center">Severidad</th>
                <th className="px-4 py-3 font-semibold">Vehículo</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Mensaje</th>
                <th className="px-4 py-3 font-semibold">Fecha / Hora</th>
                <th className="px-4 py-3 font-semibold text-center">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAlerts.map(a => (
                <tr key={a.id} className={`transition-colors ${!a.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/30'}`}>
                  <td className="px-4 py-3 text-center">
                    <div className={`mx-auto rounded-full p-1.5 w-max ${
                      a.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                      a.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{a.vehicleName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="uppercase text-[10px] bg-transparent">
                      {a.type.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.message}</td>
                  <td className="px-4 py-3 font-mono text-xs">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    {a.read ? (
                      <Badge variant="outline" className="bg-transparent text-muted-foreground border-muted-foreground">LEÍDA</Badge>
                    ) : (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">NUEVA</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!a.read && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => markAsRead(a.id)}>
                        Marcar leída
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAlerts.length === 0 && (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-green-500/50 mb-4" />
              <p>No hay alertas en esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
