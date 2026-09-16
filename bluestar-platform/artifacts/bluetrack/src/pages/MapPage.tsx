import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Info, Send, Map as MapIcon, X, Navigation } from 'lucide-react';
import { useAppStore } from '@/hooks/useData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';

// Fix leafet icon
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25,41], iconAnchor: [12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Markers
const createCustomIcon = (status: string) => {
  let bgColor = 'bg-gray-500';
  let pulse = '';

  if (status === 'moving') {
    bgColor = 'bg-green-500';
    pulse = 'animate-ping';
  } else if (status === 'stopped') {
    bgColor = 'bg-yellow-500';
  } else if (status === 'alarm') {
    bgColor = 'bg-red-500';
    pulse = 'animate-pulse';
  }

  const html = `
    <div class="relative w-6 h-6 flex items-center justify-center">
      ${pulse ? `<div class="absolute inset-0 rounded-full ${bgColor} opacity-40 ${pulse}"></div>` : ''}
      <div class="w-3.5 h-3.5 rounded-full ${bgColor} border-2 border-white shadow-md z-10"></div>
    </div>
  `;

  return L.divIcon({
    className: 'bg-transparent',
    html,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapController({ selectedVehicleId, vehicles }: { selectedVehicleId: string | null, vehicles: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVehicleId) {
      const v = vehicles.find(v => v.id === selectedVehicleId);
      if (v) {
        map.flyTo([v.lat, v.lng], 16, { animate: true, duration: 1 });
      }
    }
  }, [selectedVehicleId, vehicles, map]);

  return null;
}

export default function MapPage() {
  const { vehicles } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.plate.toLowerCase().includes(search.toLowerCase())
  );

  const selectedVehicle = vehicles.find(v => v.id === selectedId);

  const handleCommand = () => {
    toast.success('Comando enviado exitosamente al dispositivo.');
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      
      {/* Left Panel - Vehicle List */}
      <div className="w-[320px] bg-sidebar border-r border-border flex flex-col shrink-0 z-10 shadow-xl">
        <div className="p-4 border-b border-border bg-card">
          <h2 className="text-lg font-bold mb-3">Flota en tiempo real</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar vehículo..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredVehicles.map(v => (
            <div 
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                selectedId === v.id ? 'bg-primary/20 border-primary/50' : 'bg-card hover:bg-muted border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    v.status === 'moving' ? 'bg-green-500' :
                    v.status === 'stopped' ? 'bg-yellow-500' :
                    v.status === 'alarm' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="font-bold text-sm truncate w-32">{v.name}</span>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono bg-background">
                  {v.plate}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground ml-4.5">
                <span>{v.driver}</span>
                {v.status === 'moving' || v.status === 'alarm' ? (
                  <span className="font-mono font-bold text-foreground">{Math.round(v.speed)} km/h</span>
                ) : (
                  <span>0 km/h</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-black">
        <MapContainer center={[19.4326, -99.1332]} zoom={12} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController selectedVehicleId={selectedId} vehicles={vehicles} />
          
          {vehicles.map(v => (
            <Marker 
              key={v.id} 
              position={[v.lat, v.lng]} 
              icon={createCustomIcon(v.status)}
              eventHandlers={{
                click: () => setSelectedId(v.id),
              }}
            >
              <Popup className="custom-popup">
                <div className="text-sm font-sans min-w-[200px]">
                  <p className="font-bold border-b border-border/50 pb-1 mb-2">{v.name}</p>
                  <div className="space-y-1 text-muted-foreground">
                    <p className="flex justify-between"><span>Placa:</span> <span className="font-mono text-foreground">{v.plate}</span></p>
                    <p className="flex justify-between"><span>Velocidad:</span> <span className="font-mono text-foreground">{Math.round(v.speed)} km/h</span></p>
                    <p className="flex justify-between"><span>Conductor:</span> <span className="text-foreground">{v.driver}</span></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Right Panel - Vehicle Details Overlay */}
        {selectedVehicle && (
          <div className="absolute top-4 right-4 w-[320px] bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border bg-sidebar/50">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  selectedVehicle.status === 'moving' ? 'bg-green-500 animate-pulse' :
                  selectedVehicle.status === 'stopped' ? 'bg-yellow-500' :
                  selectedVehicle.status === 'alarm' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
                }`} />
                <h3 className="font-bold text-lg">{selectedVehicle.name}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setSelectedId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono border-primary/30 bg-primary/10 text-primary">
                  {selectedVehicle.plate}
                </Badge>
                <Badge className={
                  selectedVehicle.status === 'moving' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' :
                  selectedVehicle.status === 'stopped' ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' :
                  selectedVehicle.status === 'alarm' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 
                  'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                }>
                  {selectedVehicle.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Velocidad</p>
                  <p className="font-mono text-xl font-bold">{Math.round(selectedVehicle.speed)} <span className="text-sm font-sans font-normal text-muted-foreground">km/h</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Motor</p>
                  <p className={`font-bold ${selectedVehicle.engineOn ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {selectedVehicle.engineOn ? 'ENCENDIDO' : 'APAGADO'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Batería</span>
                  <span className="font-mono">{selectedVehicle.battery}%</span>
                </div>
                <Progress value={selectedVehicle.battery} className="h-1.5" />
              </div>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex gap-2">
                  <MapIcon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="leading-snug">{selectedVehicle.address}</p>
                </div>
                <div className="flex gap-2">
                  <Navigation className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="font-mono text-muted-foreground">{selectedVehicle.lat.toFixed(6)}, {selectedVehicle.lng.toFixed(6)}</p>
                </div>
                <div className="flex gap-2">
                  <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="text-muted-foreground">Visto: {new Date(selectedVehicle.lastSeen).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Ver recorrido
                </Button>
                <Button size="sm" className="w-full text-xs" onClick={handleCommand}>
                  <Send className="w-3 h-3 mr-1.5" /> Comando
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
