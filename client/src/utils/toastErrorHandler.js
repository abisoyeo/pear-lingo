import { toast } from "react-hot-toast";

export function handleApiError(
  error,
  fallbackMessage = "Something went wrong"
) {
  const message =
    error?.response?.data?.message || error?.message || fallbackMessage;

  toast.error(message);
}
