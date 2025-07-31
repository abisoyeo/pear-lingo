import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

/**
 * RouteGuard handles auth, verification, and onboarding checks.
 *
 * @param {Object} props
 * @param {boolean} requireAuth - Must be logged in
 * @param {boolean} requireVerified - true = must be verified, false = must be unverified, undefined = no check
 * @param {boolean} requireOnboarded - true = must be onboarded, false = must NOT be onboarded, undefined = no check
 * @param {boolean} publicOnly - Page only for unauthenticated users
 * @param {ReactNode} props.children
 */
const RouteGuard = ({
  requireAuth = false,
  requireVerified,
  requireOnboarded,
  publicOnly = false,
  children,
}) => {
  const { authUser } = useAuth();

  // Public-only: redirect logged-in users
  if (publicOnly && authUser) {
    if (!authUser.isVerified) return <Navigate to="/verify-email" replace />;
    if (!authUser.isOnboarded) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/" replace />;
  }

  // Require authentication
  if (requireAuth && !authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser) {
    // Priority: unverified check
    if (requireVerified !== false && !authUser.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }

    // Onboarding checks
    if (requireOnboarded === true && !authUser.isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    if (requireOnboarded === false && authUser.isOnboarded) {
      return <Navigate to="/" replace />;
    }

    // If must be unverified but user is verified
    if (requireVerified === false && authUser.isVerified) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RouteGuard;
