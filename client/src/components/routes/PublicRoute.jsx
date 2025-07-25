import { Navigate } from "react-router";
import useAuthUser from "../../hooks/useAuthUser";
import PageLoader from "../PageLoader";

const PublicOnlyRoute = ({ children }) => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return <PageLoader />;
  if (authUser?.isOnboarded) return <Navigate to="/" />;
  if (authUser) return <Navigate to="/onboarding" />;

  return children;
};

export default PublicOnlyRoute;
