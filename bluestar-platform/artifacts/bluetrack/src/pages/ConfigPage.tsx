import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ConfigPage() {
  const [tab, setTab] = useState('perfil');

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente.');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h1>
        <Button onClick={handleSave} className="font-bold shrink-0">Guardar Cambios</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-muted border border-border h-auto flex-wrap justify-start w-full">
          <TabsTrigger value="perfil" className="data-[state=active]:bg-card data-[state=active]:text-primary">Mi Perfil</TabsTrigger>
          <TabsTrigger value="empresa" className="data-[state=active]:bg-card data-[state=active]:text-primary">Empresa</TabsTrigger>
          <TabsTrigger value="usuarios" className="data-[state=active]:bg-card data-[state=active]:text-primary">Usuarios</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-card data-[state=active]:text-primary">API Keys</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="perfil" className="m-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu foto y detalles de contacto.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-2 border-border">
                    <AvatarFallback className="text-3xl bg-primary/20 text-primary">AD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Cambiar Foto</Button>
                    <p className="text-xs text-muted-foreground">JPG, GIF o PNG. Max 2MB.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" defaultValue="Administrador Sistema" className="bg-input border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" defaultValue="admin@bluetrack.com" className="bg-input border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" defaultValue="+52 55 1234 5678" className="bg-input border-border" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Cambia tu contraseña.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current_pwd">Contraseña actual</Label>
                  <Input id="current_pwd" type="password" className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_pwd">Nueva contraseña</Label>
                  <Input id="new_pwd" type="password" className="bg-input border-border" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresa" className="m-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Datos de la Empresa Operadora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nombre de la Empresa</Label>
                    <Input defaultValue="BlueStar Technology México" className="bg-input border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>RFC / Identificador Fiscal</Label>
                    <Input defaultValue="BST010101XYZ" className="bg-input border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Zona Horaria Principal</Label>
                    <Select defaultValue="cst">
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="cst">Central Time (Mexico City)</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Formato de Fecha</Label>
                    <Select defaultValue="latam">
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latam">DD/MM/YYYY</SelectItem>
                        <SelectItem value="us">MM/DD/YYYY</SelectItem>
                        <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usuarios" className="m-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuarios del Sistema</CardTitle>
                  <CardDescription>Gestiona quién tiene acceso a la plataforma.</CardDescription>
                </div>
                <Button variant="outline">+ Invitar Usuario</Button>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Usuario</th>
                      <th className="px-4 py-3">Rol</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3">
                        <p className="font-bold text-foreground">Administrador</p>
                        <p className="text-muted-foreground text-xs">admin@bluetrack.com</p>
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline" className="border-primary text-primary">SuperAdmin</Badge></td>
                      <td className="px-4 py-3 text-center"><Badge className="bg-green-500/20 text-green-500">ACTIVO</Badge></td>
                      <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Editar</Button></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <p className="font-bold text-foreground">Monitor Turno 1</p>
                        <p className="text-muted-foreground text-xs">monitor1@bluetrack.com</p>
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline">Operador</Badge></td>
                      <td className="px-4 py-3 text-center"><Badge className="bg-green-500/20 text-green-500">ACTIVO</Badge></td>
                      <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Editar</Button></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="m-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Tokens para integración con sistemas de terceros (ERP, TMS).</CardDescription>
                </div>
                <Button variant="outline">+ Generar Nueva Key</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-bold text-sm">Integración SAP</p>
                      <p className="font-mono text-muted-foreground text-xs mt-1">bt_live_*******************9f2a</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-4">Creada hace 2 meses</span>
                      <Button variant="ghost" size="sm">Copiar</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revocar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
