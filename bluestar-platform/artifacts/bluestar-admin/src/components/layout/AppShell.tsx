import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'wouter';

interface AppShellProps {
  children: React.ReactNode;
}

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/usuarios': 'Gestión de Usuarios',
  '/clientes': 'Gestión de Clientes',
  '/productos/bluetrack': 'BlueTrack - Rastreo GPS',
  '/productos/systemstar': 'systemStar - Gestión de Servidores',
  '/productos/aldrathar': 'Aldrathar - Game Metrics',
  '/dispositivos': 'Dispositivos GPS',
  '/vehiculos': 'Flota de Vehículos',
  '/homologaciones': 'Homologaciones',
  '/instalaciones': 'Citas Técnicas',
  '/servidores': 'Infraestructura',
  '/proyectos': 'Proyectos',
  '/reportes': 'Reportes del Sistema',
  '/configuracion': 'Configuración',
  '/perfil': 'Mi Perfil',
  '/notificaciones': 'Notificaciones',
};

export const AppShell = ({ children }: AppShellProps) => {
  const [location] = useLocation();
  const title = routeTitles[location] || 'BlueStar Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
