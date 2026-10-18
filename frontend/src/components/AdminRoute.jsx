/**
 * File: AdminRoute.jsx
 * Description: Auto-generated documentation for AdminRoute.jsx
 * Date: 2026-07-21
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default /**
 * Function AdminRoute
 * @param {any} props
 * @returns {any}
 */
function AdminRoute({
  children
}) {
  const location = useLocation();
  const {
    isAuthenticated,
    isAdmin
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{from:location}} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}