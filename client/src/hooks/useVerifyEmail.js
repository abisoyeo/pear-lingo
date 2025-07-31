import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail } from "../lib/api";
import { useState } from "react";
import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";
import { useNavigate } from "react-router";

const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      handleToastSuccess("Email verified successfully! Welcome aboard!");
      navigate("/");
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
    verifyEmailMutation: mutate,
    fieldErrors,
    generalError,
    clearErrors,
  };
};

export default useVerifyEmail;
