import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../lib/admin";

const useAdminUsers = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsers,
  });
};

export default useAdminUsers;
