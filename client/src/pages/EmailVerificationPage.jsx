import { useMutation } from "@tanstack/react-query";
import { AppleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useVerifyEmail from "../hooks/useVerifyEmail";
import { useCooldown } from "../hooks/useCooldown";
import ErrorAlert from "../components/ErrorAlert";
import { resendVerificationEmail } from "../lib/api";

const EmailVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef([]);

  const [feedback, setFeedback] = useState(null);
  const [resendRetryAfter, setResendRetryAfter] = useState(null);

  const handleChange = (index, value) => {
    const newCode = [...verificationCode];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setVerificationCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setVerificationCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const resendVerificationMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      setFeedback("Verification email sent successfully!");
      setResendRetryAfter(null);
    },
    onError: (error) => {
      // Handle rate limiting error
      const errorRetryAfter = error?.response?.data?.retryAfter;
      if (errorRetryAfter) {
        setResendRetryAfter(errorRetryAfter);
      }

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      setFeedback(message);
    },
  });

  const {
    verifyEmailMutation,
    fieldErrors,
    generalError,
    clearErrors,
    isPending,
    setRetryAfter,
    retryAfter: verifyRetryAfter,
  } = useVerifyEmail();

  const {
    cooldown: resendCooldown,
    isActive: resendIsActive,
    formatTime: resendFormatTime,
  } = useCooldown(resendRetryAfter);
  const {
    cooldown: verifyCooldown,
    isActive: verifyIsActive,
    formatTime: verifyFormatTime,
  } = useCooldown(verifyRetryAfter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    setRetryAfter(null);
    const code = verificationCode.join("");
    verifyEmailMutation({ code });
  };

  const handleResendCode = async () => {
    if (resendIsActive) return;

    setFeedback(null);
    setResendRetryAfter(null);
    resendVerificationMutation.mutate();
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (verificationCode.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [verificationCode]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden p-5">
        <div className="mb-6 flex items-center justify-center gap-2 ">
          <AppleIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Pear Lingo
          </span>
        </div>
        {generalError && <ErrorAlert message={generalError} />}

        <h2 className="text-xl font-semibold">Verify Your Email</h2>
        <p className="text-m opacity-70 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex justify-between">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  // maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleChange(index, val);
                  }}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-200 text-black border-2 border-gray-600 rounded-lg focus:border-blue-700 focus:outline-none"
                />
              ))}
            </div>

            {/*Error alert*/}

            {fieldErrors && (
              <p className="text-red-500 font-semibold mt-2">
                {fieldErrors.code}
              </p>
            )}

            <button
              className="btn btn-primary w-full"
              disabled={isPending || verifyIsActive}
            >
              {isPending ? (
                <>
                  {" "}
                  <span className="loading loading-spinner loading-xs"></span>
                  Verifying...
                </>
              ) : verifyIsActive ? (
                `Wait ${verifyFormatTime} to retry`
              ) : (
                "Verify Email"
              )}
            </button>
          </form>
        </div>
        <div>
          <p className="text-sm text-center mt-4">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendCode}
              disabled={resendVerificationMutation.isPending || resendIsActive}
              className={`font-semibold ${
                resendIsActive || resendVerificationMutation.isPending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {resendVerificationMutation.isPending
                ? "Sending..."
                : resendIsActive
                ? `Resend in ${resendFormatTime}`
                : "Resend Code"}
            </button>
          </p>
          {feedback && (
            <p
              className={`mt-2 text-sm text-center ${
                resendVerificationMutation.isError
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
