import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../services/auth.service';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin on component mount
    if (!isAdmin()) {
      // If not logged in or not admin, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Don't render children until we've checked authentication
  if (!isAdmin()) {
    return null;
  }

  return <>{children}</>;
} 