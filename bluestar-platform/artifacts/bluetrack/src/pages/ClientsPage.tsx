import { MOCK_CLIENTS } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Mail, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Clientes Corporativos</h1>
        <Button className="shrink-0 font-bold">+ Nuevo Cliente</Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar cliente, contacto..." 
              className="pl-9 bg-input border-border"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold w-12"></th>
                <th className="px-4 py-3 font-semibold">Empresa</th>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold text-center">Vehículos</th>
                <th className="px-4 py-3 font-semibold text-center">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MOCK_CLIENTS.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-center">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground text-base">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> {c.contactEmail}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`uppercase text-[10px] ${
                      c.plan === 'Enterprise' ? 'border-primary text-primary' : 
                      c.plan === 'Pro' ? 'border-blue-400 text-blue-400' : 'border-muted-foreground'
                    }`}>
                      {c.plan}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-lg">{c.vehicleCount}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">ACTIVO</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" /> Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
