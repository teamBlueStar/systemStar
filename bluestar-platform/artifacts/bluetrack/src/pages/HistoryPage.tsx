import { useState } from 'react';
import { useAppStore } from '@/hooks/useData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Download, Search, Route, Clock, Gauge, Car } from 'lucide-react';
import { toast } from 'sonner';

const startIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-md"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const endIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div class="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-md"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function HistoryPage() {
  const { vehicles } = useAppStore();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Mock route points
  const routePoints: [number, number][] = [
    [19.4326, -99.1332],
    [19.4426, -99.1432],
    [19.4600, -99.1500],
    [19.4800, -99.1800],
    [19.5000, -99.2000],
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDataLoaded(true);
    }, 800);
  };

  const handleExport = (format: string) => {
    toast.success(`Generando reporte en ${format}...`);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Controls */}
      <div className="w-[320px] bg-card border-r border-border p-4 flex flex-col shrink-0 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Historial de Recorridos</h2>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Vehículo</label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Fecha</label>
            <Input 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <Button className="w-full font-bold" onClick={handleSearch} disabled={loading}>
            {loading ? 'Buscando...' : (
              <><Search className="w-4 h-4 mr-2" /> Buscar Recorrido</>
            )}
          </Button>
        </div>

        {dataLoaded && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Resumen del Viaje</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Route className="w-3.5 h-3.5" /> Distancia
                  </div>
                  <p className="font-bold font-mono">145.2 <span className="text-xs font-sans text-muted-foreground">km</span></p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Gauge className="w-3.5 h-3.5" /> Vel. Máx
                  </div>
                  <p className="font-bold font-mono text-destructive">112 <span className="text-xs font-sans text-muted-foreground">km/h</span></p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Car className="w-3.5 h-3.5" /> En mov.
                  </div>
                  <p className="font-bold font-mono">3h 45m</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3.5 h-3.5" /> Detenido
                  </div>
                  <p className="font-bold font-mono">45m</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full text-xs" onClick={() => handleExport('PDF')}>
                <Download className="w-3 h-3 mr-2" /> Exportar PDF
              </Button>
              <Button variant="outline" className="w-full text-xs" onClick={() => handleExport('Excel')}>
                <Download className="w-3 h-3 mr-2" /> Exportar Excel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Area - Map & Timeline */}
      <div className="flex-1 flex flex-col bg-background">
        {dataLoaded ? (
          <>
            <div className="flex-1 min-h-[400px] relative z-10 border-b border-border">
              <MapContainer center={[19.4600, -99.1600]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={routePoints} color="hsl(var(--primary))" weight={4} opacity={0.8} />
                <Marker position={routePoints[0]} icon={startIcon}>
                  <Popup>Inicio: 08:00 AM</Popup>
                </Marker>
                <Marker position={routePoints[routePoints.length - 1]} icon={endIcon}>
                  <Popup>Fin: 12:30 PM</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="h-[250px] p-4 overflow-y-auto bg-card">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Eventos del Viaje</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { time: '08:00 AM', event: 'Motor encendido', type: 'info', icon: startIcon },
                  { time: '09:15 AM', event: 'Exceso de velocidad (112 km/h)', type: 'warning', icon: endIcon },
                  { time: '10:30 AM', event: 'Parada (15 min)', type: 'info', icon: startIcon },
                  { time: '12:30 PM', event: 'Motor apagado', type: 'info', icon: endIcon },
                ].map((ev, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-background bg-border shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border bg-muted/30 shadow">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-sm text-foreground">{ev.event}</div>
                        <time className="font-mono text-xs text-muted-foreground">{ev.time}</time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
            <Route className="w-16 h-16 mb-4 opacity-20" />
            <p>Selecciona un vehículo y fecha para ver el historial.</p>
          </div>
        )}
      </div>
    </div>
  );
}
