import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { state } = useAppContext();
  const { user } = state;

  if (!user) {
    // 未認証の場合は認証ページにリダイレクト
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
