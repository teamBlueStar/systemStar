import React, { useState } from 'react';
import { toast } from 'sonner';
import { Shield, Key, Building2, Globe } from 'lucide-react';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('empresa');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuración guardada exitosamente');
  };

  const copyKey = () => {
    toast.success('API Key copiada al portapapeles');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-48 flex flex-col gap-1">
        {[
          { id: 'empresa', icon: Building2, label: 'Empresa' },
          { id: 'idioma', icon: Globe, label: 'Localización' },
          { id: 'seguridad', icon: Shield, label: 'Seguridad' },
          { id: 'api', icon: Key, label: 'API Keys' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left ${
              activeTab === tab.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-card-border'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 max-w-2xl">
        {activeTab === 'empresa' && (
          <form onSubmit={handleSave} className="space-y-6 bg-card border border-card-border p-6 rounded-lg">
            <div>
              <h3 className="text-lg font-medium">Perfil de la Empresa</h3>
              <p className="text-sm text-muted-foreground mb-4">Información pública de BlueStar Technology.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre comercial</label>
                <input defaultValue="BlueStar Technology" className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo de contacto</label>
                <input defaultValue="contacto@bluestar.tech" className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección fiscal</label>
                <textarea rows={3} defaultValue="Av. Innovación 123, Ciudad de México" className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary resize-none" />
              </div>
            </div>
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">Guardar cambios</button>
          </form>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">API Keys</h3>
                <p className="text-sm text-muted-foreground">Gestiona los tokens de acceso para integraciones externas.</p>
              </div>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">Generar Key</button>
            </div>

            <div className="bg-card border border-card-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Token</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Creado</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3">Integración SAP</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">sk_live_••••••••••••8a9f</td>
                    <td className="px-4 py-3 text-muted-foreground">12/01/2024</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={copyKey} className="text-primary hover:underline text-xs">Copiar</button>
                      <button className="text-destructive hover:underline text-xs">Revocar</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Portal Clientes</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">sk_live_••••••••••••3b2c</td>
                    <td className="px-4 py-3 text-muted-foreground">05/11/2023</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={copyKey} className="text-primary hover:underline text-xs">Copiar</button>
                      <button className="text-destructive hover:underline text-xs">Revocar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Placeholder for other tabs to keep it complete visually */}
        {(activeTab === 'seguridad' || activeTab === 'idioma') && (
          <div className="bg-card border border-card-border p-6 rounded-lg text-center text-muted-foreground">
            Opciones de {activeTab} en desarrollo.
          </div>
        )}
      </div>
    </div>
  );
};
