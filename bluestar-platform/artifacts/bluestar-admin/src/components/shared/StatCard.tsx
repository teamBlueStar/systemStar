import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
  badge?: string;
  dotColor?: 'red' | 'green' | 'amber' | 'blue';
}

export const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass, badge, dotColor }: StatCardProps) => {
  return (
    <div className={`bg-card border border-card-border rounded-lg p-5 flex flex-col justify-between hover-elevate transition-all ${colorClass || ''}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          {dotColor && (
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
              dotColor === 'green' ? 'bg-success shadow-success/50' : 
              dotColor === 'red' ? 'bg-destructive shadow-destructive/50' : 
              dotColor === 'amber' ? 'bg-warning shadow-warning/50' : 
              'bg-primary shadow-primary/50'
            }`} />
          )}
          <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
        </div>
        
        {badge && (
          <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive border border-destructive/20">
            {badge}
          </span>
        )}
        
        {trend && (
          <div className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};
