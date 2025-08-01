import { useState } from "react";
import { AppleIcon, ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router";
import useForgotPassword from "../hooks/useForgotPassword";
import { useCooldown } from "../hooks/useCooldown";
import ErrorAlert from "../components/ErrorAlert";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const {
    forgotPasswordMutation,
    fieldErrors,
    generalError,
    clearErrors,
    isPending,
    isSuccess,
    retryAfter,
    setRetryAfter,
  } = useForgotPassword();

  const { cooldown, isActive, formatTime } = useCooldown(retryAfter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isActive) return;

    clearErrors();
    setRetryAfter(null);
    forgotPasswordMutation({ email });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col max-w-4xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full px-8 py-4 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <AppleIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Pear Lingo
            </span>
          </div>

          {/* ERROR */}
          {generalError && <ErrorAlert message={generalError} />}

          {/* FORM */}
          {!isSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Forgot Password</h2>
                  <p className="text-m opacity-70">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {fieldErrors.email && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isPending || isActive}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Sending link...
                      </>
                    ) : isActive ? (
                      `Wait ${formatTime} to retry`
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      to="/login"
                      className="text-sm text-primary hover:underline flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* SUCCESS MESSAGE */}
          {isSuccess && (
            <div className="text-center px-4 py-6 bg-base-200 rounded-lg mt-6">
              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-base-content">
                If an account exists for{" "}
                <span className="font-semibold">{email}</span>, you will receive
                a password reset link shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
