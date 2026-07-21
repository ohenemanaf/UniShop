/**
 * File: ProtectedRoute.jsx
 * Description: Auto-generated documentation for ProtectedRoute.jsx
 * Date: 2026-07-21
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default /**
 * Function ProtectedRoute
 * @param {any} props
 * @returns {any}
 */
function ProtectedRoute({
  children,
  adminOnly = false
}) {
  const {
    isAuthenticated,
    isAdmin
  } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{
      from: location
    }} replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}