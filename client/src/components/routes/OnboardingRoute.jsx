import RouteGuard from "./RouteGuard";

/**
 * OnboardingRoute component that wraps children with RouteGuard
 * to ensure they are only accessible when the user is authenticated,
 * verified, and onboarded.
 * @param {Object} props
 * @param {ReactNode} props.children - The child components to render
 * * @returns {JSX.Element} - The wrapped children with RouteGuard
 */
export default ({ children }) => (
  <RouteGuard requireAuth requireVerified>
    {children}
  </RouteGuard>
);
