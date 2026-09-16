import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Wrench, Settings, AlertTriangle } from 'lucide-react';

const TASKS = [
  { id: 1, vehicle: 'T-01 Trailer Caja Seca', task: 'Cambio de Aceite', dueDate: '2023-11-01', dueKm: 150000, currentKm: 145020, status: 'ok' },
  { id: 2, vehicle: 'C-02 Camioneta Reparto', task: 'Revisión Frenos', dueDate: '2023-10-15', dueKm: 46000, currentKm: 45000, status: 'soon' },
  { id: 3, vehicle: 'T-02 Trailer Refrigerado', task: 'Rotación Llantas', dueDate: '2023-09-30', dueKm: 110000, currentKm: 112040, status: 'overdue' },
  { id: 4, vehicle: 'C-01 Camioneta Reparto', task: 'Afinación Mayor', dueDate: '2023-12-01', dueKm: 60000, currentKm: 56000, status: 'ok' },
];

export default function MaintenancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Mantenimiento</h1>
        <Button className="shrink-0 font-bold">+ Registrar Mantenimiento</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TASKS.map(task => (
          <Card key={task.id} className="overflow-hidden border-border bg-card">
            <div className={`h-1.5 w-full ${
              task.status === 'ok' ? 'bg-green-500' : 
              task.status === 'soon' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={`font-bold ${
                  task.status === 'ok' ? 'text-green-500 border-green-500/50' : 
                  task.status === 'soon' ? 'text-yellow-500 border-yellow-500/50' : 'text-red-500 border-red-500/50'
                }`}>
                  {task.status === 'ok' ? 'AL DÍA' : task.status === 'soon' ? 'PRÓXIMO' : 'VENCIDO'}
                </Badge>
                {task.status === 'overdue' && <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />}
              </div>
              <h3 className="font-bold text-lg">{task.vehicle}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Wrench className="w-3.5 h-3.5" /> {task.task}
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Fecha Est.</span>
                <span className="font-mono">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5"><Settings className="w-4 h-4"/> Odom. Límite</span>
                <span className="font-mono">{task.dueKm.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded-md">
                <span className="text-muted-foreground font-medium">Odom. Actual</span>
                <span className={`font-mono font-bold ${task.currentKm > task.dueKm ? 'text-red-500' : ''}`}>
                  {task.currentKm.toLocaleString()} km
                </span>
              </div>
              <Button variant="outline" className="w-full mt-2" size="sm">Marcar Completado</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
