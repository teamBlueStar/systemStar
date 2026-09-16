import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, Loader2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/hooks/useData';
import { toast } from 'sonner';

type Request = {
  id: number;
  vehicleId: number | null;
  scheduledDate: string;
  timeSlot: string;
  address: string;
  notes: string | null;
  status: string;
};

export default function InstallationPage() {
  const { vehicles } = useAppStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ vehicleId: '', scheduledDate: '', timeSlot: '09:00 - 11:00', address: '', notes: '' });

  const load = () => fetch('/api/fleet/installation-requests', { credentials: 'include' })
    .then((r) => r.ok ? r.json() : [])
    .then(setRequests)
    .catch(() => setRequests([]));

  useEffect(() => { load(); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch('/api/fleet/installation-requests', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      toast.error(data.error || 'No se pudo solicitar la cita');
      return;
    }
    toast.success('Cita técnica solicitada');
    setForm({ vehicleId: '', scheduledDate: '', timeSlot: '09:00 - 11:00', address: '', notes: '' });
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Instalación de dispositivo</h1>
        <p className="text-sm text-muted-foreground mt-1">Solicita una cita técnica para agregar un GPS a tu flota.</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_1fr] gap-6">
        <form onSubmit={submit} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Wrench className="w-5 h-5" /></div>
            <div><h2 className="font-semibold">Nueva cita técnica</h2><p className="text-xs text-muted-foreground">Un técnico confirmará el horario.</p></div>
          </div>
          <div className="space-y-2">
            <Label>Vehículo</Label>
            <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm">
              <option value="">Sin asignar todavía</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} · {vehicle.plate}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Fecha</Label><Input type="date" required value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Horario</Label><select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} className="w-full h-10 rounded-md border border-border bg-input px-2 text-sm"><option>09:00 - 11:00</option><option>11:00 - 13:00</option><option>15:00 - 17:00</option></select></div>
          </div>
          <div className="space-y-2"><Label>Dirección de instalación</Label><Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Calle, número, ciudad" /></div>
          <div className="space-y-2"><Label>Notas</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Tipo de unidad, requisitos de acceso..." /></div>
          <Button disabled={loading} className="w-full">{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</> : <><CalendarClock className="w-4 h-4 mr-2" />Solicitar cita</>}</Button>
        </form>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border"><h2 className="font-semibold">Mis solicitudes</h2><p className="text-xs text-muted-foreground mt-1">Seguimiento de instalaciones y asignaciones.</p></div>
          <div className="divide-y divide-border/60">
            {requests.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Aún no hay solicitudes.</div>}
            {requests.map((request) => (
              <div key={request.id} className="p-4 flex items-start justify-between gap-4">
                <div><p className="font-medium">{request.scheduledDate} · {request.timeSlot}</p><p className="text-sm text-muted-foreground">{request.address}</p><p className="text-xs text-muted-foreground mt-1">{request.notes || 'Sin notas'}</p></div>
                <span className={`text-xs px-2 py-1 rounded-full border ${request.status === 'completed' ? 'text-green-400 border-green-400/30' : 'text-primary border-primary/30'}`}>{request.status === 'requested' ? 'Solicitada' : request.status === 'scheduled' ? 'Confirmada' : request.status === 'completed' ? 'Completada' : request.status}</span>
              </div>
            ))}
          </div>
          {requests.length > 0 && <div className="p-4 text-xs text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" />El equipo técnico actualizará el estado desde BlueStar Admin.</div>}
        </div>
      </div>
    </div>
  );
}