import { useEffect, useState } from 'react';
import { Car, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Vehicle = { id: number; clientId: number; name: string; plate: string; brand: string | null; model: string | null; status: string; driver: string | null; homologationStatus: string };
type Client = { id: number; name: string };

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ clientId: '', name: '', plate: '', brand: '', model: '', year: '', driver: '' });
  const load = () => Promise.all([fetch('/api/fleet/vehicles', { credentials: 'include' }).then((r) => r.ok ? r.json() : []), fetch('/api/fleet/clients', { credentials: 'include' }).then((r) => r.ok ? r.json() : [])]).then(([nextVehicles, nextClients]) => { setVehicles(nextVehicles); setClients(nextClients); }).catch(() => {});
  useEffect(() => { load(); }, []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/fleet/vehicles', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) { toast.error(data.error || 'No se pudo agregar el vehículo'); return; }
    toast.success('Vehículo agregado'); setOpen(false); setForm({ clientId: '', name: '', plate: '', brand: '', model: '', year: '', driver: '' }); load();
  };
  const remove = async (id: number) => { if (!confirm('¿Eliminar este vehículo?')) return; const response = await fetch(`/api/fleet/vehicles/${id}`, { method: 'DELETE', credentials: 'include' }); if (response.ok) { toast.success('Vehículo eliminado'); load(); } };
  return <div className="space-y-6">
    <div className="flex justify-between items-center"><div><h2 className="text-lg font-medium">Flota de vehículos</h2><p className="text-sm text-muted-foreground mt-1">El equipo técnico también puede administrar altas y bajas.</p></div><button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"><Plus className="w-4 h-4" />Agregar vehículo</button></div>
    <div className="bg-card border border-card-border rounded-lg overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/20"><th className="px-4 py-3 text-left text-muted-foreground">Vehículo</th><th className="px-4 py-3 text-left text-muted-foreground">Cliente</th><th className="px-4 py-3 text-left text-muted-foreground">Placa</th><th className="px-4 py-3 text-left text-muted-foreground">Estado</th><th className="px-4 py-3 text-left text-muted-foreground">Homologación</th><th className="px-4 py-3 text-right text-muted-foreground">Acciones</th></tr></thead><tbody>{vehicles.map((vehicle) => <tr key={vehicle.id} className="border-b border-border/50"><td className="px-4 py-3"><span className="font-medium flex items-center gap-2"><Car className="w-4 h-4 text-primary" />{vehicle.name}</span><span className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model}</span></td><td className="px-4 py-3 text-muted-foreground">{clients.find((client) => client.id === vehicle.clientId)?.name || `#${vehicle.clientId}`}</td><td className="px-4 py-3 font-mono">{vehicle.plate}</td><td className="px-4 py-3">{vehicle.status}</td><td className="px-4 py-3 text-muted-foreground">{vehicle.homologationStatus}</td><td className="px-4 py-3 text-right"><button onClick={() => remove(vehicle.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table>{vehicles.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay vehículos registrados.</div>}</div>
    {open && <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}><form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card border border-border rounded-xl p-6 space-y-3"><h3 className="text-lg font-semibold">Agregar vehículo</h3><select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"><option value="">Selecciona cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>{[['name','Nombre de unidad'],['plate','Placa'],['brand','Marca'],['model','Modelo'],['year','Año'],['driver','Conductor']].map(([key, placeholder]) => <input key={key} required={key === 'name' || key === 'plate'} type={key === 'year' ? 'number' : 'text'} placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" />)}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button><button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Guardar vehículo</button></div></form></div>}
  </div>;
};