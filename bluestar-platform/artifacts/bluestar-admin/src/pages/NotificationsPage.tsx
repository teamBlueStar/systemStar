import React, { useState } from 'react';
import { mockNotifications, Notification } from '@/data/mock';
import { AlertTriangle, Activity, CheckCircle2, Info, Check } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Centro de Notificaciones</h2>
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-primary hover:underline">
          <Check className="w-4 h-4" /> Marcar todas como leídas
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No tienes notificaciones.</div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-4 flex gap-4 transition-colors ${notif.read ? 'bg-transparent opacity-70' : 'bg-muted/10'}`}>
                <div className={`mt-1 rounded-full p-2 h-fit ${
                  notif.type === 'Alerta' ? 'bg-destructive/10 text-destructive' :
                  notif.type === 'Error' ? 'bg-warning/10 text-warning' :
                  notif.type === 'Evento' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {notif.type === 'Alerta' ? <AlertTriangle className="w-5 h-5" /> :
                   notif.type === 'Error' ? <Activity className="w-5 h-5" /> :
                   notif.type === 'Evento' ? <CheckCircle2 className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm ${notif.read ? 'font-medium text-muted-foreground' : 'font-bold text-foreground'}`}>{notif.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{notif.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.description}</p>
                </div>
                {!notif.read && (
                  <button onClick={() => markAsRead(notif.id)} className="text-xs text-muted-foreground hover:text-primary transition-colors h-fit mt-1 whitespace-nowrap">
                    Marcar leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
