import { Navigate } from "react-router";
import useAuthUser from "../../hooks/useAuthUser";
import PageLoader from "../PageLoader";

/**
 * @param {Object} props
 * @param {boolean} props.requireAuth - Redirect to login if not authenticated
 * @param {boolean} props.requireVerified - Redirect to verify-email if not verified
 * @param {boolean} props.requireOnboarded - Redirect to onboarding if not onboarded
 * @param {ReactNode} props.children
 */
const RouteGuard = ({
  requireAuth = false,
  requireVerified = false,
  requireOnboarded = false,
  children,
}) => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return <PageLoader />;

  // Require login
  if (requireAuth && !authUser) {
    return <Navigate to="/login" replace />;
  }

  // Require not logged in (public only)
  if (!requireAuth && authUser) {
    if (!authUser.isVerified) return <Navigate to="/verify-email" replace />;
    if (!authUser.isOnboarded) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/" replace />;
  }

  // Require verified email
  if (requireVerified && authUser && !authUser.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Require onboarding
  if (requireOnboarded && authUser && !authUser.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default RouteGuard;
