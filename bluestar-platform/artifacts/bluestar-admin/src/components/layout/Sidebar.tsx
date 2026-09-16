import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  PackageOpen, 
  Navigation, 
  Car, 
  Server, 
  Kanban, 
  FileBarChart, 
  Settings, 
  UserCircle,
  LogOut,
  ChevronDown,
  BadgeCheck,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon: Icon, label, active }: NavItemProps) => {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all
      ${active 
        ? 'bg-primary/10 text-primary border-l-2 border-primary' 
        : 'text-muted-foreground border-l-2 border-transparent hover:text-foreground hover:bg-card-border'}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [productsOpen, setProductsOpen] = React.useState(true);

  return (
    <div className="w-64 flex flex-col bg-sidebar border-r border-sidebar-border h-full text-sidebar-foreground">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-primary font-bold text-lg font-mono">
          <Navigation className="w-5 h-5 fill-primary" />
          BlueStar
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location === '/dashboard'} />
        <NavItem href="/usuarios" icon={Users} label="Usuarios" active={location === '/usuarios'} />
        <NavItem href="/clientes" icon={Building2} label="Clientes" active={location === '/clientes'} />
        
        <div className="mt-1">
          <button 
            onClick={() => setProductsOpen(!productsOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card-border"
          >
            <div className="flex items-center gap-3">
              <PackageOpen className="w-4 h-4" />
              <span>Productos</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {productsOpen && (
            <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-2">
              <Link href="/productos/bluetrack" className={`text-sm py-1.5 px-3 rounded-md block transition-colors ${location === '/productos/bluetrack' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>BlueTrack</Link>
              <Link href="/productos/systemstar" className={`text-sm py-1.5 px-3 rounded-md block transition-colors ${location === '/productos/systemstar' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>systemStar</Link>
              <Link href="/productos/aldrathar" className={`text-sm py-1.5 px-3 rounded-md block transition-colors ${location === '/productos/aldrathar' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Aldrathar</Link>
            </div>
          )}
        </div>

        <NavItem href="/dispositivos" icon={Navigation} label="Dispositivos GPS" active={location === '/dispositivos'} />
        <NavItem href="/vehiculos" icon={Car} label="Vehículos" active={location === '/vehiculos'} />
        <NavItem href="/homologaciones" icon={BadgeCheck} label="Homologaciones" active={location === '/homologaciones'} />
        <NavItem href="/instalaciones" icon={CalendarCheck} label="Citas técnicas" active={location === '/instalaciones'} />
        <NavItem href="/servidores" icon={Server} label="Servidores" active={location === '/servidores'} />
        <NavItem href="/proyectos" icon={Kanban} label="Proyectos" active={location === '/proyectos'} />
        <NavItem href="/reportes" icon={FileBarChart} label="Reportes" active={location === '/reportes'} />

        <div className="mt-auto pt-6">
          <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sistema</div>
          <NavItem href="/configuracion" icon={Settings} label="Configuración" active={location === '/configuracion'} />
          <NavItem href="/perfil" icon={UserCircle} label="Mi Perfil" active={location === '/perfil'} />
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-destructive border-l-2 border-transparent hover:bg-destructive/10 transition-all mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
