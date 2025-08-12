import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      handleToastSuccess("Logout successful! See you next time!");
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
