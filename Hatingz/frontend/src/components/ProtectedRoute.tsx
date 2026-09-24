// Responsável: Enzo
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredToken } from '../services/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

