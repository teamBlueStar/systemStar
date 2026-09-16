import React from 'react';
import { mockProjects } from '@/data/mock';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users } from 'lucide-react';

export const ProjectsPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <div key={project.id} className="bg-card border border-card-border rounded-lg p-5 flex flex-col hover-elevate">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-foreground text-lg">{project.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                project.status === 'Completado' ? 'bg-success/10 text-success border-success/20' :
                project.status === 'En desarrollo' ? 'bg-primary/10 text-primary border-primary/20' :
                project.status === 'Pausado' ? 'bg-warning/10 text-warning border-warning/20' :
                'bg-muted text-muted-foreground border-border'
              }`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 flex-1">{project.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-muted-foreground">Progreso</span>
                <span className="font-mono">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className={`h-1.5 ${project.progress === 100 ? '[&>div]:bg-success' : ''}`} />
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {project.deadline}
              </div>
              <div className="flex -space-x-2">
                {project.team.map((member, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[10px] font-bold text-foreground">
                    {member}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
