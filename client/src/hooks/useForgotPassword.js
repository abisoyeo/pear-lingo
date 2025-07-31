import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import { useState } from "react";
import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";

const useForgotPassword = () => {
  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      handleToastSuccess("Password reset link sent to your email!");
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
        const msg = responseData?.error || "An error occurred.";
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
    isSuccess,
    forgotPasswordMutation: mutate,
    fieldErrors,
    generalError,
    clearErrors,
  };
};

export default useForgotPassword;
