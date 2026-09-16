import { MOCK_DRIVERS } from '@/data/mock';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Car, Route, Gauge, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DriversPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Conductores</h1>
        <Button className="shrink-0 font-bold">+ Nuevo Conductor</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Buscar conductor, licencia..." 
          className="pl-9 bg-input border-border"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_DRIVERS.map(driver => (
          <Card key={driver.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
            <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
              <Avatar className="w-12 h-12 border border-border">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {driver.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Badge className={
                driver.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
              }>
                {driver.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
              </Badge>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg leading-tight mb-1">{driver.name}</h3>
              <p className="text-sm font-mono text-muted-foreground mb-4">Licencia: {driver.license}</p>

              <div className="space-y-3">
                <div className="flex items-center text-sm gap-2">
                  <Car className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{driver.vehicleId ? 'T-01 Trailer Caja Seca' : 'Sin asignar'}</span>
                </div>
                <div className="flex items-center text-sm gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-mono">{driver.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/50">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Route className="w-3.5 h-3.5" /> Total Recorrido
                  </div>
                  <p className="font-bold font-mono">{driver.totalKm.toLocaleString()} <span className="text-xs font-sans font-normal text-muted-foreground">km</span></p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Gauge className="w-3.5 h-3.5" /> Vel. Promedio
                  </div>
                  <p className="font-bold font-mono">{driver.avgSpeed} <span className="text-xs font-sans font-normal text-muted-foreground">km/h</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
