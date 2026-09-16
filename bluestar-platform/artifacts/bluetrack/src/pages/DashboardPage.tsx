import { useAppStore } from '@/hooks/useData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Car, WifiOff, AlertTriangle, Route, Gauge, Cpu, BellRing } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25,41], iconAnchor: [12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

const CHART_DATA = [
  { time: '00:00', activos: 12, alertas: 2 },
  { time: '04:00', activos: 10, alertas: 1 },
  { time: '08:00', activos: 45, alertas: 5 },
  { time: '12:00', activos: 110, alertas: 12 },
  { time: '16:00', activos: 115, alertas: 8 },
  { time: '20:00', activos: 60, alertas: 4 },
  { time: '23:59', activos: 25, alertas: 3 },
];

export default function DashboardPage() {
  const { vehicles, alerts } = useAppStore();

  const moving = vehicles.filter(v => v.status === 'moving').length;
  const stopped = vehicles.filter(v => v.status === 'stopped').length;
  const offline = vehicles.filter(v => v.status === 'offline').length;
  const activeAlerts = alerts.filter(a => !a.read).length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="En Movimiento" value={moving} icon={Activity} color="text-green-500" />
        <StatCard title="Detenidos" value={stopped} icon={Car} color="text-yellow-500" />
        <StatCard title="Desconectados" value={offline} icon={WifiOff} color="text-muted-foreground" />
        <StatCard title="Alertas Activas" value={activeAlerts} icon={AlertTriangle} color="text-destructive" />
        
        <StatCard title="Distancia Total Hoy" value="2,847 km" icon={Route} color="text-primary" />
        <StatCard title="Velocidad Promedio" value="67 km/h" icon={Gauge} color="text-primary" />
        <StatCard title="Dispositivos Conectados" value={vehicles.length - offline} icon={Cpu} color="text-primary" />
        <StatCard title="Eventos del Día" value="142" icon={BellRing} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Vista General de Flota
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden h-[350px] border-t border-border">
            <MapContainer center={[19.4326, -99.1332]} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {vehicles.map(v => (
                <Marker key={v.id} position={[v.lat, v.lng]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{v.name}</p>
                      <p>{v.plate}</p>
                      <p>{v.speed} km/h</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {alerts.slice(0, 6).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className={`mt-0.5 rounded-full p-1.5 ${
                    alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                    alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alert.vehicleName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 opacity-70">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Actividad de la flota – últimas 24 horas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlertas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="activos" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorActivos)" />
                <Area type="monotone" dataKey="alertas" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorAlertas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-muted/50 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
