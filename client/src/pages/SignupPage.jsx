import { useState } from "react";
import { AppleIcon } from "lucide-react";
import { Link } from "react-router";
import ErrorAlert from "../components/ErrorAlert";
import useSignUp from "../hooks/useSignup";
import { useCooldown } from "../hooks/useCooldown";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const {
    isPending,
    signupMutation,
    fieldErrors,
    generalError,
    clearErrors,
    retryAfter,
    setRetryAfter,
  } = useSignUp();

  const { cooldown, isActive, formatTime } = useCooldown(retryAfter);

  const handleSignup = (e) => {
    e.preventDefault();

    if (isActive) return;

    clearErrors();
    setRetryAfter(null);
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 sm:p-6 md:p-8 lg:py-6">
      <div className="min-h-[300px] border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 flex flex-col">
          {/* LOGO */}
          <div className="mb-2 flex items-center justify-start gap-2">
            <AppleIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Pear Lingo
            </span>
          </div>

          {/* GENERAL ERROR MESSAGE IF ANY */}
          <ErrorAlert message={generalError} />

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm font-semibold opacity-60">
                    Join Pear Lingo and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-2">
                  {/* FULLNAME */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                    {fieldErrors.fullName && (
                      <span className="text-error text-xs mt-1">
                        {fieldErrors.fullName}
                      </span>
                    )}
                  </div>
                  {/* EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                    {fieldErrors.email && (
                      <span className="text-error text-xs mt-1">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                  {/* PASSWORD */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    {fieldErrors.password && (
                      <span className="text-error text-xs mt-1">
                        {fieldErrors.password}
                      </span>
                    )}
                    <PasswordStrengthMeter password={signupData.password} />
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full"
                  disabled={isPending || isActive}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : isActive ? (
                    `Wait ${formatTime} to retry`
                  ) : (
                    "Create Account"
                  )}{" "}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/call.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-2 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
