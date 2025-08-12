import RouteGuard from "./RouteGuard";

/**
 * PrivateRoute component that wraps children with RouteGuard
 * requiring authentication, email verification, and onboarding.
 *
 * @param {Object} props
 * @param {ReactNode} props.children - The child components to render
 */
export default ({ children }) => (
  <RouteGuard requireAuth requireVerified requireOnboarded={true}>
    {children}
  </RouteGuard>
);
