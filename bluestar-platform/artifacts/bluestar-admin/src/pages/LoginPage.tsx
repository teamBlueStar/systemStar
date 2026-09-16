import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Navigation, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const LoginPage = () => {
  const { login, loggedIn } = useAuth();
  const [, setLocation] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { email: '', password: '', remember: false }
  });

  if (loggedIn) {
    setLocation('/dashboard');
    return null;
  }

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const error = await login(data.email, data.password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
    } else {
      setLocation('/dashboard');
    }
  };

  const handleForgot = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Contacta al administrador del sistema');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-card-border rounded-xl shadow-2xl overflow-hidden relative z-10">
        <div className="px-8 py-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 mb-6">
            <Navigation className="w-6 h-6 text-primary fill-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">BlueStar Technology</h1>
          <p className="text-sm text-muted-foreground mb-8">Acceso al panel de operaciones</p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Correo electrónico</label>
              <input
                {...register('email')}
                type="email"
                required
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
                placeholder="admin@bluestar.tech"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Contraseña</label>
                <a href="#" onClick={handleForgot} className="text-xs text-primary hover:underline">¿Olvidé mi contraseña?</a>
              </div>
              <input
                {...register('password')}
                type="password"
                required
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                {...register('remember')}
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">Recordar sesión</label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-primary text-primary-foreground font-medium py-2.5 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-8 text-xs text-muted-foreground/50 border-t border-border pt-4 w-full text-center">
            Uso exclusivo de ingenieros y supervisores
          </div>
        </div>
      </div>
    </div>
  );
};
