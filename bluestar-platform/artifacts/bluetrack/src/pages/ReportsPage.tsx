import { useState } from 'react';
import { useAppStore } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
  { name: 'Lun', km: 245, hours: 4.5, speed: 65, events: 2 },
  { name: 'Mar', km: 312, hours: 6.0, speed: 72, events: 5 },
  { name: 'Mié', km: 156, hours: 2.5, speed: 58, events: 1 },
  { name: 'Jue', km: 410, hours: 8.2, speed: 75, events: 8 },
  { name: 'Vie', km: 280, hours: 5.5, speed: 68, events: 3 },
  { name: 'Sáb', km: 120, hours: 2.0, speed: 60, events: 0 },
  { name: 'Dom', km: 0, hours: 0, speed: 0, events: 0 },
];

export default function ReportsPage() {
  const { vehicles } = useAppStore();
  const [tab, setTab] = useState('km');
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleExport = (format: string) => {
    const extension = format.toLowerCase();
    fetch(`/api/fleet/reports/export?format=${extension}`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No se pudo generar el reporte');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-bluetrack.${extension}`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`Reporte ${format} descargado`);
      })
      .catch((error) => toast.error(error.message));
  };

  const getDataKey = () => {
    switch (tab) {
      case 'km': return 'km';
      case 'hours': return 'hours';
      case 'speed': return 'speed';
      case 'events': return 'events';
      case 'fuel': return 'km'; // Mocking fuel with km pattern
      default: return 'km';
    }
  };

  const getUnit = () => {
    switch (tab) {
      case 'km': return 'km';
      case 'hours': return 'h';
      case 'speed': return 'km/h';
      case 'events': return 'eventos';
      case 'fuel': return 'L';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('Excel')}>
            <Download className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button onClick={() => handleExport('PDF')}>
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-[250px] space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Vehículo</label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Todos los vehículos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los vehículos</SelectItem>
              {vehicles.map(v => (
                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-[200px] space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Fecha Inicio</label>
          <Input type="date" className="bg-input border-border" />
        </div>
        <div className="w-full md:w-[200px] space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Fecha Fin</label>
          <Input type="date" className="bg-input border-border" />
        </div>
        <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto font-bold px-8">
          {loading ? 'Generando...' : <><Search className="w-4 h-4 mr-2" /> Buscar</>}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-muted border border-border h-auto flex-wrap justify-start w-full">
          <TabsTrigger value="km" className="data-[state=active]:bg-card data-[state=active]:text-primary">Kilometraje</TabsTrigger>
          <TabsTrigger value="hours" className="data-[state=active]:bg-card data-[state=active]:text-primary">Horas de conducción</TabsTrigger>
          <TabsTrigger value="speed" className="data-[state=active]:bg-card data-[state=active]:text-primary">Velocidades</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-card data-[state=active]:text-primary">Eventos</TabsTrigger>
          <TabsTrigger value="fuel" className="data-[state=active]:bg-card data-[state=active]:text-primary">Consumo estimado</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Resumen Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: '#fff' }}
                  formatter={(value: number) => [`${value} ${getUnit()}`, '']}
                />
                <Bar dataKey={getDataKey()} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-muted/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total</p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground font-mono">
              1,523 <span className="text-sm font-sans font-normal text-muted-foreground">{getUnit()}</span>
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-muted/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Promedio Diario</p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground font-mono">
              217.5 <span className="text-sm font-sans font-normal text-muted-foreground">{getUnit()}</span>
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-muted/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Variación vs Sem Ant.</p>
            <h3 className="text-3xl font-bold tracking-tight text-green-500 font-mono">
              +12.4%
            </h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
