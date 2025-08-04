import { createContext, useContext } from "react";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/common/PageLoader";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
