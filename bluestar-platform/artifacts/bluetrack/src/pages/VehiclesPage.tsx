import { useState } from 'react';
import { Link } from 'wouter';
import { useAppStore } from '@/hooks/useData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VehiclesPage() {
  const { vehicles } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.plate.toLowerCase().includes(search.toLowerCase()) ||
                          v.driver.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const movingCount = vehicles.filter(v => v.status === 'moving').length;
  const stoppedCount = vehicles.filter(v => v.status === 'stopped').length;
  const offlineCount = vehicles.filter(v => v.status === 'offline').length;
  const alarmCount = vehicles.filter(v => v.status === 'alarm').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Vehículos</h1>
        <Button className="shrink-0 font-bold">+ Nuevo Vehículo</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">En Movimiento</p>
            <p className="text-2xl font-bold">{movingCount}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Detenidos</p>
            <p className="text-2xl font-bold">{stoppedCount}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Desconectados</p>
            <p className="text-2xl font-bold">{offlineCount}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">En Alarma</p>
            <p className="text-2xl font-bold">{alarmCount}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre, placa o conductor..." 
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
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="moving">En Movimiento</SelectItem>
              <SelectItem value="stopped">Detenidos</SelectItem>
              <SelectItem value="offline">Desconectados</SelectItem>
              <SelectItem value="alarm">Alarma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 font-semibold">Vehículo</th>
                <th className="px-4 py-3 font-semibold">Placa</th>
                <th className="px-4 py-3 font-semibold">Conductor</th>
                <th className="px-4 py-3 font-semibold">Velocidad</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Última Conexión</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredVehicles.map(v => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-center">
                    <div className={`w-2.5 h-2.5 rounded-full mx-auto ${
                      v.status === 'moving' ? 'bg-green-500' :
                      v.status === 'stopped' ? 'bg-yellow-500' :
                      v.status === 'alarm' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{v.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-mono bg-transparent">{v.plate}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.driver}</td>
                  <td className="px-4 py-3 font-mono">{Math.round(v.speed)} km/h</td>
                  <td className="px-4 py-3">
                    <Badge className={
                      v.status === 'moving' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' :
                      v.status === 'stopped' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' :
                      v.status === 'alarm' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 
                      'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }>
                      {v.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(v.lastSeen).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/mapa?vehicle=${v.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVehicles.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron vehículos que coincidan con los filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
