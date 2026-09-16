import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Menu, Search, User as UserIcon } from 'lucide-react';
import { Link } from 'wouter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockNotifications } from '@/data/mock';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { user, logout } = useAuth();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar (CMD+K)" 
            className="w-64 bg-input/50 border border-border rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>

        <Link href="/notificaciones" className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full border border-background">
              {unreadCount}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                <UserIcon className="w-4 h-4" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil" className="cursor-pointer">Mi Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracion" className="cursor-pointer">Configuración</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
