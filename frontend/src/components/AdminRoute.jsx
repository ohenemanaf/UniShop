/**
 * File: AdminRoute.jsx
 * Description: Auto-generated documentation for AdminRoute.jsx
 * Date: 2026-07-21
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default /**
 * Function AdminRoute
 * @param {any} props
 * @returns {any}
 */
function AdminRoute({
  children
}) {
  const {
    isAuthenticated,
    isAdmin
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}