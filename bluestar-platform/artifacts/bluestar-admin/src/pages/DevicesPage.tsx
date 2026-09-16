import { useEffect, useState } from 'react';
import { Cpu, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Device = { id: number; clientId: number; vehicleId: number | null; imei: string; model: string; status: string; signal: number; firmwareVersion: string | null };
type Client = { id: number; name: string };
type Vehicle = { id: number; clientId: number; name: string; plate: string };

export const DevicesPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ clientId: '', vehicleId: '', imei: '', model: 'Teltonika FMB920', simCard: '', firmwareVersion: '1.0.0' });
  const load = () => Promise.all([
    fetch('/api/fleet/devices', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
    fetch('/api/fleet/clients', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
    fetch('/api/fleet/vehicles', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
  ]).then(([nextDevices, nextClients, nextVehicles]) => { setDevices(nextDevices); setClients(nextClients); setVehicles(nextVehicles); }).catch(() => {});
  useEffect(() => { load(); }, []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/fleet/devices', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { toast.error(data.error || 'No se pudo registrar el dispositivo'); return; }
    toast.success('Dispositivo registrado'); setOpen(false); setForm({ clientId: '', vehicleId: '', imei: '', model: 'Teltonika FMB920', simCard: '', firmwareVersion: '1.0.0' }); load();
  };
  const remove = async (id: number) => { if (!confirm('¿Eliminar este dispositivo?')) return; const response = await fetch(`/api/fleet/devices/${id}`, { method: 'DELETE', credentials: 'include' }); if (response.ok) { toast.success('Dispositivo eliminado'); load(); } };
  const clientVehicles = vehicles.filter((vehicle) => String(vehicle.clientId) === form.clientId);
  return <div className="space-y-6">
    <div className="flex justify-between items-center"><div><h2 className="text-lg font-medium">Dispositivos GPS</h2><p className="text-sm text-muted-foreground mt-1">Registro, asignación y baja de hardware.</p></div><button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"><Plus className="w-4 h-4" />Registrar dispositivo</button></div>
    <div className="bg-card border border-card-border rounded-lg overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/20"><th className="px-4 py-3 text-left text-muted-foreground">Dispositivo</th><th className="px-4 py-3 text-left text-muted-foreground">Cliente</th><th className="px-4 py-3 text-left text-muted-foreground">Vehículo</th><th className="px-4 py-3 text-left text-muted-foreground">Estado</th><th className="px-4 py-3 text-right text-muted-foreground">Acciones</th></tr></thead><tbody>{devices.map((device) => <tr key={device.id} className="border-b border-border/50"><td className="px-4 py-3"><p className="font-mono text-xs">{device.imei}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Cpu className="w-3 h-3" />{device.model}</p></td><td className="px-4 py-3 text-muted-foreground">{clients.find((client) => client.id === device.clientId)?.name || `#${device.clientId}`}</td><td className="px-4 py-3 text-muted-foreground">{vehicles.find((vehicle) => vehicle.id === device.vehicleId)?.plate || 'Sin asignar'}</td><td className="px-4 py-3">{device.status} · señal {device.signal}/5</td><td className="px-4 py-3 text-right"><button onClick={() => remove(device.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table>{devices.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay dispositivos registrados.</div>}</div>
    {open && <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}><form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card border border-border rounded-xl p-6 space-y-3"><h3 className="text-lg font-semibold">Registrar dispositivo</h3><select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value, vehicleId: '' })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"><option value="">Selecciona cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select><select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"><option value="">Sin asignar</option>{clientVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} · {vehicle.plate}</option>)}</select><input required pattern="[0-9]{10,20}" placeholder="IMEI" value={form.imei} onChange={(e) => setForm({ ...form, imei: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm font-mono" /><input required placeholder="SIM Card" value={form.simCard} onChange={(e) => setForm({ ...form, simCard: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" /><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button><button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Guardar dispositivo</button></div></form></div>}
  </div>;
};