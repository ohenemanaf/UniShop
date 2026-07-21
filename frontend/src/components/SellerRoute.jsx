/**
 * File: SellerRoute.jsx
 * Description: Auto-generated documentation for SellerRoute.jsx
 * Date: 2026-07-21
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default /**
 * Function SellerRoute
 * @param {any} props
 * @returns {any}
 */
function SellerRoute({
  children
}) {
  const {
    isAuthenticated,
    isSeller
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isSeller) {
    return <Navigate to="/" replace />;
  }
  return children;
}