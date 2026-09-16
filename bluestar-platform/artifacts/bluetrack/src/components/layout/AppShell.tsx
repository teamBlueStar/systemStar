import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
