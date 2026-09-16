import { useEffect, useState } from 'react';
import { Plus, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { toast } from 'sonner';

type User = { id: number; name: string; email: string; role: string; clientId: number | null; active: boolean };
type Client = { id: number; name: string };

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'cliente', clientId: '' });

  const load = () => {
    Promise.all([
      fetch('/api/fleet/users', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
      fetch('/api/fleet/clients', { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
    ]).then(([nextUsers, nextClients]) => { setUsers(nextUsers); setClients(nextClients); }).catch(() => {});
  };
  useEffect(load, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/fleet/users', {
      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) { toast.error(data.error || 'No se pudo crear el usuario'); return; }
    toast.success('Usuario creado'); setOpen(false);
    setForm({ name: '', email: '', password: '', role: 'cliente', clientId: '' }); load();
  };

  const roleLabel = (role: string) => role === 'cliente' ? 'Cliente' : role === 'tech' ? 'Técnico' : 'Administrador';
  const RoleIcon = ({ role }: { role: string }) => role === 'tech' ? <Wrench className="w-4 h-4" /> : role === 'cliente' ? <UserRound className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-lg font-medium">Usuarios y permisos</h2><p className="text-sm text-muted-foreground mt-1">Crea accesos de cliente y técnico con alcance controlado.</p></div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"><Plus className="w-4 h-4" />Nuevo usuario</button>
      </div>
      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/20"><th className="px-4 py-3 text-left text-muted-foreground">Usuario</th><th className="px-4 py-3 text-left text-muted-foreground">Rol</th><th className="px-4 py-3 text-left text-muted-foreground">Cliente asignado</th><th className="px-4 py-3 text-left text-muted-foreground">Estado</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id} className="border-b border-border/50">
            <td className="px-4 py-3"><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></td>
            <td className="px-4 py-3"><span className="inline-flex items-center gap-2 text-primary"><RoleIcon role={user.role} />{roleLabel(user.role)}</span></td>
            <td className="px-4 py-3 text-muted-foreground">{clients.find((client) => client.id === user.clientId)?.name || (user.role === 'cliente' ? 'Sin asignar' : 'Todos')}</td>
            <td className="px-4 py-3"><span className="text-green-400">● Activo</span></td>
          </tr>)}</tbody>
        </table>
        {users.length === 0 && <div className="p-8 text-center text-muted-foreground">No hay usuarios registrados.</div>}
      </div>
      {open && <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
        <form onSubmit={save} onClick={(event) => event.stopPropagation()} className="w-full max-w-md bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Crear acceso</h3>
          <input required placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" />
          <input required type="email" placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" />
          <input required minLength={8} type="password" placeholder="Contraseña (mínimo 8 caracteres)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"><option value="cliente">Cliente</option><option value="tech">Técnico</option><option value="admin">Administrador</option></select>
          {form.role === 'cliente' && <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"><option value="">Selecciona cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>}
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancelar</button><button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Crear usuario</button></div>
        </form>
      </div>}
    </div>
  );
};