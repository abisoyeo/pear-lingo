import RouteGuard from "./RouteGuard";

/**
 * PublicRoute component that wraps children with RouteGuard
 * to ensure they are only accessible when not authenticated.
 * @param {Object} props
 * @param {ReactNode} props.children - The child components to render
 * @returns {JSX.Element} - The wrapped children with RouteGuard
 */
export default ({ children }) => <RouteGuard publicOnly>{children}</RouteGuard>;
