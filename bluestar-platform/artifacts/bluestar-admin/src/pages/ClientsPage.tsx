import { useEffect, useState } from 'react';
import { Building, Mail, Plus, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

type Client = { id: number; name: string; contactEmail: string; plan: string; status: string; features: Record<string, boolean> };

export const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', contactEmail: '', plan: 'Básico', reports: true, installationRequests: true, homologations: false, multiVehicle: true });
  const load = () => fetch('/api/fleet/clients', { credentials: 'include' }).then((r) => r.ok ? r.json() : []).then(setClients).catch(() => {});
  useEffect(() => { load(); }, []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/fleet/clients', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, contactEmail: form.contactEmail, plan: form.plan, features: { reports: form.reports, installationRequests: form.installationRequests, homologations: form.homologations, multiVehicle: form.multiVehicle } }) });
    const data = await response.json();
    if (!response.ok) { toast.error(data.error || 'No se pudo crear el cliente'); return; }
    toast.success('Cliente creado'); setOpen(false); setForm({ name: '', contactEmail: '', plan: 'Básico', reports: true, installationRequests: true, homologations: false, multiVehicle: true }); load();
  };
  return <div className="space-y-6">
    <div className="flex justify-between items-center"><div><h2 className="text-lg font-medium">Directorio de clientes</h2><p className="text-sm text-muted-foreground mt-1">Cada cliente puede tener permisos y módulos distintos.</p></div><button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"><Plus className="w-4 h-4" />Nuevo cliente</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{clients.map((client) => <div key={client.id} className="bg-card border border-card-border rounded-lg p-5">
      <div className="flex items-start justify-between"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building className="w-5 h-5 text-primary" /></div><span className="text-xs rounded-full border border-primary/30 px-2 py-1 text-primary">{client.plan}</span></div>
      <h3 className="font-semibold mt-4">{client.name}</h3><p className="text-sm text-muted-foreground mt-1 flex items-center gap-2"><Mail className="w-3 h-3" />{client.contactEmail}</p>
      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center gap-2"><SlidersHorizontal className="w-3.5 h-3.5" />{Object.values(client.features || {}).filter(Boolean).length} módulos habilitados</div>
    </div>)}</div>
    {open && <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}><form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-card border border-border rounded-xl p-6 space-y-4"><h3 className="text-lg font-semibold">Nuevo cliente</h3><input required placeholder="Empresa" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" /><input required type="email" placeholder="Correo de contacto" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" /><select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"><option>Básico</option><option>Pro</option><option>Enterprise</option></select><div className="space-y-2 text-sm">{[['reports','Reportes'],['installationRequests','Solicitar instalaciones'],['homologations','Homologaciones'],['multiVehicle','Multi-vehículo']].map(([key, label]) => <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />{label}</label>)}</div><div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button><button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Guardar cliente</button></div></form></div>}
  </div>;
};