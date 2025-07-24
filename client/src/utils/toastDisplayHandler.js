import { toast } from "react-hot-toast";

export function handleToastError(
  error,
  fallbackMessage = "Something went wrong"
) {
  const message =
    error?.response?.data?.message || error?.message || fallbackMessage;

  toast.error(message);
}

export function handleToastSuccess(fallbackMessage = "Success") {
  const message = fallbackMessage;

  toast.success(message);
}
