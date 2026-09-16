import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { UserCircle, Camera } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil actualizado correctamente');
  };

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Contraseña actualizada');
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center gap-6 bg-card border border-card-border p-6 rounded-lg">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary border-dashed">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-foreground" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mt-2">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSave} className="bg-card border border-card-border p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium border-b border-border pb-2 mb-4">Datos Personales</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre completo</label>
            <input defaultValue={user?.name} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo electrónico</label>
            <input defaultValue={user?.email} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono (opcional)</label>
            <input placeholder="+52 123 456 7890" className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 mt-2">
            Guardar datos
          </button>
        </form>

        <form onSubmit={handlePassword} className="bg-card border border-card-border p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-medium border-b border-border pb-2 mb-4">Cambiar Contraseña</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contraseña actual</label>
            <input type="password" required className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nueva contraseña</label>
            <input type="password" required className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmar nueva contraseña</label>
            <input type="password" required className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
          </div>
          <button type="submit" className="w-full bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 mt-2">
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};
