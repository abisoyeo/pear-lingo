import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";
import { completeOnboarding } from "../lib/api";
import { useState } from "react";

const useOnboarding = () => {
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      handleToastSuccess("Profile onboarded successfully");
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
    isPending,
    onboardingMutation: mutate,
    fieldErrors,
    generalError,
    clearErrors,
  };
};

export default useOnboarding;
