import { useState } from "react";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";

import { handleToastSuccess } from "../../utils/toastDisplayHandler";
import { LANGUAGES } from "../../constants";
import ErrorAlert from "../../components/common/ErrorAlert";
import useOnboarding from "../../hooks/useOnboarding";
import { useAuth } from "../../context/AuthContext";

const OnboardingPage = () => {
  const { authUser } = useAuth();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const {
    onboardingMutation,
    isPending,
    fieldErrors,
    generalError,
    clearErrors,
  } = useOnboarding();

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    handleToastSuccess("Random profile picture generated!");
  };

  return (
    <>
      {/* Display error if mutation failed */}
      {generalError && <ErrorAlert message={generalError} />}

      {/* Onboarding form container */}
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-2xl font-bold text-center mb-6">
              Complete Your Profile To Start Your Learning Journey
            </h1>

            {/* ==================== FORM START ==================== */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile picture preview section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                  {fieldErrors.profilePic && (
                    <span className="text-error text-xs mt-1">
                      {fieldErrors.profilePic}
                    </span>
                  )}
                </div>

                {/* Button to generate random avatar */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-accent"
                  >
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>

              {/* Full Name input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({ ...formState, fullName: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
                {fieldErrors.fullName && (
                  <span className="text-error text-xs mt-1">
                    {fieldErrors.fullName}
                  </span>
                )}
              </div>

              {/* Bio input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
                {fieldErrors.bio && (
                  <span className="text-error text-xs mt-1">
                    {fieldErrors.bio}
                  </span>
                )}
              </div>

              {/* Language selection section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Native Language Dropdown */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.nativeLanguage && (
                    <span className="text-error text-xs mt-1">
                      {fieldErrors.nativeLanguage}
                    </span>
                  )}
                </div>

                {/* Learning Language Dropdown */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.learningLanguage && (
                    <span className="text-error text-xs mt-1">
                      {fieldErrors.learningLanguage}
                    </span>
                  )}
                </div>
              </div>
              {fieldErrors.language && (
                <span className="text-error text-xs">
                  {fieldErrors.language}
                </span>
              )}

              {/* Location input with icon */}
              <div className="form-control mt-1">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
                {fieldErrors.location && (
                  <span className="text-error text-xs mt-1">
                    {fieldErrors.location}
                  </span>
                )}
              </div>

              {/* Submit button */}
              <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </form>
            {/* ==================== FORM END ==================== */}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage;
