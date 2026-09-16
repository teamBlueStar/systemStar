import { useState } from 'react';
import { MOCK_GEOFENCES } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Circle, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function GeofencesPage() {
  const [geofences, setGeofences] = useState(MOCK_GEOFENCES);

  const toggleGeofence = (id: string, field: 'active' | 'entryAlert' | 'exitAlert') => {
    setGeofences(prev => prev.map(g => g.id === id ? { ...g, [field]: !g[field] } : g));
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel */}
      <div className="w-[400px] bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Geocercas</h2>
          <Button size="sm" className="font-bold"><Plus className="w-4 h-4 mr-1"/> Nueva</Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {geofences.map(g => (
            <div key={g.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                    {g.name}
                  </h3>
                  <Badge variant="outline" className="mt-1 text-[10px] uppercase font-mono">
                    {g.type === 'circle' ? 'Circular' : 'Polígono'}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado Activo</span>
                  <Switch checked={g.active} onCheckedChange={() => toggleGeofence(g.id, 'active')} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5"/> Alerta de Entrada</span>
                  <Switch checked={g.entryAlert} onCheckedChange={() => toggleGeofence(g.id, 'entryAlert')} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5"/> Alerta de Salida</span>
                  <Switch checked={g.exitAlert} onCheckedChange={() => toggleGeofence(g.id, 'exitAlert')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-black z-10">
        <MapContainer center={[19.4600, -99.1800]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {geofences.map(g => {
            if (!g.active) return null;
            if (g.type === 'circle' && g.center && g.radius) {
              return (
                <Circle 
                  key={g.id} 
                  center={g.center as [number, number]} 
                  radius={g.radius} 
                  pathOptions={{ color: g.color, fillColor: g.color, fillOpacity: 0.2 }}
                >
                  <Popup>{g.name}</Popup>
                </Circle>
              );
            }
            if (g.type === 'polygon' && g.points) {
              return (
                <Polygon 
                  key={g.id} 
                  positions={g.points} 
                  pathOptions={{ color: g.color, fillColor: g.color, fillOpacity: 0.2 }}
                >
                  <Popup>{g.name}</Popup>
                </Polygon>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
}
