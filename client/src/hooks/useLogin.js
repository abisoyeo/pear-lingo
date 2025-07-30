import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { useState } from "react";
import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";

const useLogin = () => {
  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      handleToastSuccess("Login successful! Welcome back!");
    },
    onError: (error) => {
      const responseData = error.response?.data;

      if (Array.isArray(responseData?.error)) {
        // Validation (field) errors
        const errors = {};
        responseData.error.forEach((err) => {
          errors[err.field] = err.issue;
        });
        setFieldErrors(errors);
        handleToastError(error);
      } else {
        // General error
        const msg = responseData?.message || "An error occurred.";
        setGeneralError(msg);
        handleToastError(error);
      }
    },
  });

  const clearErrors = () => {
    setFieldErrors({});
    setGeneralError("");
  };

  return {
    error,
    isPending,
    loginMutation: mutate,
    fieldErrors,
    generalError,
    clearErrors,
  };
};

export default useLogin;
