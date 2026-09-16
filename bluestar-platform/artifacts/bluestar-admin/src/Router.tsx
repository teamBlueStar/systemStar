import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';
import { AppShell } from '@/components/layout/AppShell';

// Lazy load pages for better structure
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UsersPage = React.lazy(() => import('@/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const ClientsPage = React.lazy(() => import('@/pages/ClientsPage').then(m => ({ default: m.ClientsPage })));
const DevicesPage = React.lazy(() => import('@/pages/DevicesPage').then(m => ({ default: m.DevicesPage })));
const VehiclesPage = React.lazy(() => import('@/pages/VehiclesPage').then(m => ({ default: m.VehiclesPage })));
const ServersPage = React.lazy(() => import('@/pages/ServersPage').then(m => ({ default: m.ServersPage })));
const ProjectsPage = React.lazy(() => import('@/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ReportsPage = React.lazy(() => import('@/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const HomologationsPage = React.lazy(() => import('@/pages/HomologationsPage'));
const InstallationsPage = React.lazy(() => import('@/pages/InstallationsPage'));

// Products
const BlueTrackPage = React.lazy(() => import('@/pages/products/BlueTrackPage').then(m => ({ default: m.BlueTrackPage })));
const SystemStarPage = React.lazy(() => import('@/pages/products/SystemStarPage').then(m => ({ default: m.SystemStarPage })));
const AldratharPage = React.lazy(() => import('@/pages/products/AldratharPage').then(m => ({ default: m.AldratharPage })));

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { loggedIn, loading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!loading && !loggedIn) {
      setLocation('/login');
    }
  }, [loggedIn, loading, setLocation]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!loggedIn) return null;

  return (
    <AppShell>
      <React.Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Cargando...</div>}>
        <Component {...rest} />
      </React.Suspense>
    </AppShell>
  );
};

export const Router = () => {
  const { loggedIn, loading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!loading && (window.location.pathname === '/' || window.location.pathname === import.meta.env.BASE_URL)) {
      setLocation(loggedIn ? '/dashboard' : '/login');
    }
  }, [loggedIn, loading, setLocation]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      <Route path="/dashboard"><ProtectedRoute component={DashboardPage} /></Route>
      <Route path="/usuarios"><ProtectedRoute component={UsersPage} /></Route>
      <Route path="/clientes"><ProtectedRoute component={ClientsPage} /></Route>
      
      <Route path="/productos/bluetrack"><ProtectedRoute component={BlueTrackPage} /></Route>
      <Route path="/productos/systemstar"><ProtectedRoute component={SystemStarPage} /></Route>
      <Route path="/productos/aldrathar"><ProtectedRoute component={AldratharPage} /></Route>
      
      <Route path="/dispositivos"><ProtectedRoute component={DevicesPage} /></Route>
      <Route path="/vehiculos"><ProtectedRoute component={VehiclesPage} /></Route>
      <Route path="/homologaciones"><ProtectedRoute component={HomologationsPage} /></Route>
      <Route path="/instalaciones"><ProtectedRoute component={InstallationsPage} /></Route>
      <Route path="/servidores"><ProtectedRoute component={ServersPage} /></Route>
      <Route path="/proyectos"><ProtectedRoute component={ProjectsPage} /></Route>
      <Route path="/reportes"><ProtectedRoute component={ReportsPage} /></Route>
      <Route path="/configuracion"><ProtectedRoute component={SettingsPage} /></Route>
      <Route path="/perfil"><ProtectedRoute component={ProfilePage} /></Route>
      <Route path="/notificaciones"><ProtectedRoute component={NotificationsPage} /></Route>
      
      <Route path="/:rest*">
        <div className="flex h-screen items-center justify-center text-muted-foreground flex-col gap-4">
          <h2 className="text-2xl font-mono">404 - No Encontrado</h2>
          <button onClick={() => setLocation('/')} className="text-primary hover:underline">Volver al inicio</button>
        </div>
      </Route>
    </Switch>
  );
};
