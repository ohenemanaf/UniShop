import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

/** Returns a safe in-app path to send the user back to after signing in, or null. */
export function returnPathFrom(state) {
  const from = state?.from;
  const path = from?.pathname;
  if (!path || !path.startsWith('/') || path.startsWith('//') || AUTH_PATHS.includes(path)) return null;
  return path + (from.search || '');
}

/** Location state to attach to a link to /login or /register so the user comes back here. */
export function loginStateFor(location) {
  return AUTH_PATHS.includes(location.pathname) ? location.state : { from: location };
}

/** Sends a signed-out user to login and remembers the page they were on. */
export function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => navigate('/login', { state: { from: location } }), [navigate, location]);
}
