import { Redirect, Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AppProvider } from '@/hooks/useData';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';

import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import MapPage from '@/pages/MapPage';
import VehiclesPage from '@/pages/VehiclesPage';
import DevicesPage from '@/pages/DevicesPage';
import DriversPage from '@/pages/DriversPage';
import HistoryPage from '@/pages/HistoryPage';
import GeofencesPage from '@/pages/GeofencesPage';
import AlertsPage from '@/pages/AlertsPage';
import ReportsPage from '@/pages/ReportsPage';
import MaintenancePage from '@/pages/MaintenancePage';
import ClientsPage from '@/pages/ClientsPage';
import ConfigPage from '@/pages/ConfigPage';
import InstallationPage from '@/pages/InstallationPage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ component: Component, path }: { component: any, path: string }) {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (loading) return (
          <div className="flex h-screen items-center justify-center bg-background">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        );
        return isAuthenticated ? (
          <AppShell>
            <Component />
          </AppShell>
        ) : (
          <Redirect to="/login" />
        );
      }}
    </Route>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>

      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/mapa" component={MapPage} />
      <ProtectedRoute path="/vehiculos" component={VehiclesPage} />
      <ProtectedRoute path="/dispositivos" component={DevicesPage} />
      <ProtectedRoute path="/conductores" component={DriversPage} />
      <ProtectedRoute path="/historial" component={HistoryPage} />
      <ProtectedRoute path="/geocercas" component={GeofencesPage} />
      <ProtectedRoute path="/alertas" component={AlertsPage} />
      <ProtectedRoute path="/reportes" component={ReportsPage} />
      <ProtectedRoute path="/mantenimiento" component={MaintenancePage} />
      <ProtectedRoute path="/clientes" component={ClientsPage} />
      <ProtectedRoute path="/configuracion" component={ConfigPage} />
      <ProtectedRoute path="/instalacion" component={InstallationPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
