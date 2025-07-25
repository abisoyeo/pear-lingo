import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";

import {
  handleToastError,
  handleToastSuccess,
} from "../utils/toastDisplayHandler";
import { completeOnboarding } from "../lib/api";
import { LANGUAGES } from "../constants";
import ErrorAlert from "../components/ErrorAlert";

const OnboardingPage = () => {
  // Get authenticated user info and loading status
  const { isLoading, authUser } = useAuthUser();

  // Initialize React Query client
  const queryClient = useQueryClient();

  // Form state populated with current user info or empty defaults
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  // Mutation to submit onboarding form
  const {
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      handleToastSuccess("Profile onboarded successfully");
      // Refresh the authUser cache with updated profile info
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => handleToastError(error, "Onboarding failed"),
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  // Generates a random avatar from external service
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // Random number from 1–100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    handleToastSuccess("Random profile picture generated!");
  };

  return (
    <>
      {/* Display error if mutation failed */}
      {error && (
        <div className="alert alert-error mb-4">
          <ErrorAlert error={error} />
        </div>
      )}

      {/* Onboarding form container */}
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Complete Your Profile
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
                </div>
              </div>

              {/* Location input with icon */}
              <div className="form-control">
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
