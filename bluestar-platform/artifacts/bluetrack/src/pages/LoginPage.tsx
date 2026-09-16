import { useState } from 'react';
import { useLocation } from 'wouter';
import { SatelliteDish, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const error = await login(email, password);
    setSubmitting(false);
    if (error) {
      // Show error inline
      const el = document.getElementById('login-error');
      if (el) { el.textContent = error; el.style.display = 'block'; }
    } else {
      setLocation('/dashboard');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-[400px] z-10 px-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b border-border/50 bg-muted/20">
            <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg mb-4">
              <SatelliteDish className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">BlueTrack</h1>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold">by BlueStar Technology</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div
              id="login-error"
              style={{ display: 'none' }}
              className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md px-3 py-2"
            />

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@bluetrack.com"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a href="#" className="text-xs text-primary hover:underline">¿Olvidé mi contraseña?</a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                Recordar sesión
              </Label>
            </div>

            <Button type="submit" disabled={submitting} className="w-full font-bold">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Iniciando sesión...</>
              ) : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
