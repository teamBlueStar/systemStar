import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, Map, Car, Cpu, Users, History, 
  MapPin, Bell, BarChart2, Wrench, Building2, Settings,
  SatelliteDish
} from 'lucide-react';
import { useAppStore } from '@/hooks/useData';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [location] = useLocation();
  const { alerts } = useAppStore();
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mapa en Tiempo Real', path: '/mapa', icon: Map },
    { name: 'Vehículos', path: '/vehiculos', icon: Car },
    { name: 'Dispositivos', path: '/dispositivos', icon: Cpu },
    { name: 'Conductores', path: '/conductores', icon: Users },
    { name: 'Historial', path: '/historial', icon: History },
    { name: 'Geocercas', path: '/geocercas', icon: MapPin },
    { name: 'Alertas', path: '/alertas', icon: Bell, badge: unreadAlerts },
    { name: 'Reportes', path: '/reportes', icon: BarChart2 },
    { name: 'Mantenimiento', path: '/mantenimiento', icon: Wrench },
    { name: 'Clientes', path: '/clientes', icon: Building2 },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
    { name: 'Instalación GPS', path: '/instalacion', icon: Wrench },
  ];

  return (
    <aside className="w-[220px] bg-sidebar border-r border-sidebar-border flex flex-col h-full shrink-0">
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-2 text-primary font-bold text-lg">
        <SatelliteDish className="w-5 h-5 text-primary" />
        <span className="text-sidebar-foreground tracking-tight">BlueTrack</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(item => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}>
                <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")} />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
