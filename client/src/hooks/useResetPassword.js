import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import { useState } from "react";
import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const useResetPassword = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully, redirecting...", {
        duration: 2000,
      });
      navigate("/login");
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
    resetPasswordMutation: mutate,
    fieldErrors,
    generalError,
    clearErrors,
  };
};

export default useResetPassword;
