import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Layout({ children, header, footer }: LayoutProps) {
  return (
    <div className="layout">
      {header && (
        <header className="layout__header">
          {header}
        </header>
      )}
      
      <main className="layout__main">
        {children}
      </main>
      
      {footer && (
        <footer className="layout__footer">
          {footer}
        </footer>
      )}
    </div>
  );
}
