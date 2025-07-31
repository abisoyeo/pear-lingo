import { useState } from "react";
import { useParams } from "react-router";
import { AppleIcon, Lock } from "lucide-react";
import toast from "react-hot-toast";
import useResetPassword from "../hooks/useResetPassword";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const {
    resetPasswordMutation,
    fieldErrors,
    generalError,
    clearErrors,
    isPending,
  } = useResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation({ token, password });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col max-w-4xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="mx-auto p-4 sm:p-6 flex flex-col">
          {/* LOGO */}
          <div className="mb-2 flex items-center justify-center gap-2">
            <AppleIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
              Pear Lingo
            </span>
          </div>
        </div>
        {/* ERROR MESSAGE */}
        {generalError && <ErrorAlert message={generalError} />}

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <input
                      icon={Lock}
                      type="password"
                      className="input input-bordered w-full"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {fieldErrors.password && (
                      <span className="text-red-500 text-sm">
                        {fieldErrors.password}
                      </span>
                    )}
                  </div>
                  <div className="form-control w-full space-y-2">
                    <input
                      icon={Lock}
                      type="password"
                      className="input input-bordered w-full"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Resetting...
                      </>
                    ) : (
                      "Set New Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
