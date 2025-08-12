import { useState, useEffect } from "react";

export function useCooldown(retryAfter) {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!retryAfter) return;

    setCooldown(retryAfter);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return {
    cooldown,
    isActive: cooldown > 0,
    formatTime: formatTime(cooldown),
  };
}
