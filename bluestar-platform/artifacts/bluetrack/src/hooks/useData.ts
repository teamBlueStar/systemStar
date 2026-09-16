import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_VEHICLES, MOCK_ALERTS, Vehicle, Alert } from '../data/mock';
import { useAuthContext } from '@/contexts/AuthContext';

interface AppContextType {
  vehicles: Vehicle[];
  alerts: Alert[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  useEffect(() => {
    if (!isAuthenticated) {
      setVehicles([]);
      return;
    }
    fetch('/api/fleet/vehicles', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : [])
      .then((rows: Array<Record<string, unknown>>) => {
        if (rows.length === 0) return;
        setVehicles(rows.map((row) => ({
          id: String(row.id),
          name: String(row.name || 'Vehículo'),
          plate: String(row.plate || ''),
          driver: String(row.driver || 'Sin asignar'),
          status: (row.status || 'offline') as Vehicle['status'],
          speed: Number(row.speed || 0),
          lat: Number(row.lat || 19.4326),
          lng: Number(row.lng || -99.1332),
          address: String(row.address || 'Sin ubicación'),
          lastSeen: String(row.lastSeen || new Date().toISOString()),
          battery: 100,
          gpsStatus: row.status === 'offline' ? 'lost' : 'good',
          engineOn: row.status === 'moving',
          odometer: 0,
          fuelLevel: 0,
          clientId: String(row.clientId || ''),
        })));
      })
      .catch(() => {});

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'moving' || v.status === 'alarm') {
          return {
            ...v,
            lat: v.lat + (Math.random() * 0.002 - 0.001),
            lng: v.lng + (Math.random() * 0.002 - 0.001),
            speed: Math.max(10, v.speed + (Math.random() * 10 - 5)),
            lastSeen: new Date().toISOString()
          };
        }
        return v;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return React.createElement(AppContext.Provider, {
    value: { vehicles, alerts, markAsRead, markAllAsRead }
  }, children);
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}
