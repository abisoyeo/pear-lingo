import { Navigate } from "react-router";
import useAuthUser from "../../hooks/useAuthUser";
import PageLoader from "../PageLoader";

const PrivateRoute = ({ children }) => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return <PageLoader />;
  if (!authUser || !authUser.isOnboarded) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
