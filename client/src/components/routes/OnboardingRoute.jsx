import { Navigate } from "react-router";
import useAuthUser from "../../hooks/useAuthUser";
import PageLoader from "../PageLoader";

const OnboardingRoute = ({ children }) => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return <PageLoader />;

  if (!authUser) return <Navigate to="/login" />;
  if (authUser.isOnboarded) return <Navigate to="/" />;

  return children;
};

export default OnboardingRoute;
