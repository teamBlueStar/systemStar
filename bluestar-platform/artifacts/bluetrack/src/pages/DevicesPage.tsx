import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '@/hooks/useData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Signal, SignalHigh, SignalLow, SignalMedium, SignalZero, WifiOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DevicesPage() {
  const [, setLocation] = useLocation();
  const [devices, setDevices] = useState<Array<any>>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/fleet/devices', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : [])
      .then(setDevices)
      .catch(() => setDevices([]));
  }, []);

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.imei.toLowerCase().includes(search.toLowerCase()) || 
                          d.vehicleName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSignalIcon = (signal: number) => {
    if (signal >= 4) return <SignalHigh className="w-4 h-4 text-green-500" />;
    if (signal >= 2) return <SignalMedium className="w-4 h-4 text-yellow-500" />;
    if (signal > 0) return <SignalLow className="w-4 h-4 text-orange-500" />;
    return <SignalZero className="w-4 h-4 text-destructive" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dispositivos GPS</h1>
        <Button onClick={() => setLocation('/instalacion')} className="shrink-0 font-bold">+ Solicitar instalación</Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar por IMEI o vehículo..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-input border-border">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">IMEI</th>
                <th className="px-4 py-3 font-semibold">Modelo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Vehículo</th>
                <th className="px-4 py-3 font-semibold">Última Conexión</th>
                <th className="px-4 py-3 font-semibold text-center">Señal</th>
                <th className="px-4 py-3 font-semibold">SIM Card</th>
                <th className="px-4 py-3 font-semibold">Firmware</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDevices.map(d => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold">{d.imei}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.model}</td>
                  <td className="px-4 py-3">
                    <Badge className={
                      d.status === 'online' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' :
                      d.status === 'offline' ? 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30' :
                      'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    }>
                      {d.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{d.vehicleName}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{d.lastConnection ? new Date(d.lastConnection).toLocaleString() : 'Sin conexión'}</td>
                  <td className="px-4 py-3 text-center flex justify-center">{getSignalIcon(d.signal)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{d.simCard}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.firmwareVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
