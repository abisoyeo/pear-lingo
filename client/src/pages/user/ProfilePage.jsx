import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, changePassword } from "../../lib/api";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import { UserIcon, LockIcon, CameraIcon, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../../constants";
import { capitialize } from "../../lib/utils";

import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      handleToastSuccess("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditing(false);
    },
    onError: handleToastError,
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      handleToastSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    },
    onError: (error) => handleToastError(error),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setProfileData((prev) => ({ ...prev, profilePic: randomAvatar }));

    handleToastSuccess("Random profile picture generated!");
  };

  const startEditing = () => {
    setProfileData({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      location: authUser?.location || "",
      profilePic: authUser?.profilePic || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Profile</h1>
        <p className="text-base-content/70 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring-4 ring-primary/20">
                  <img
                    src={
                      isEditing ? profileData?.profilePic : authUser?.profilePic
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{authUser?.fullName}</h2>
                <p className="text-base-content/70">{authUser?.email}</p>
                <div className="badge badge-primary mt-2">
                  {authUser?.role === "super_admin"
                    ? "Super Admin"
                    : authUser?.role === "admin"
                    ? "Admin"
                    : "User"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserIcon className="size-5" />
                  Profile Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="btn btn-primary btn-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleRandomAvatar}
                      className="btn btn-outline btn-sm"
                    >
                      <ShuffleIcon className="size-4 mr-2" /> Generate Random
                      Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Full Name
                        </span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Location</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Native Language
                        </span>
                      </label>
                      <input
                        type="text"
                        name="nativeLanguage"
                        value={profileData.nativeLanguage}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Learning Language
                        </span>
                      </label>
                      <input
                        type="text"
                        name="learningLanguage"
                        value={profileData.learningLanguage}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div> */}
                  {/* Language selection section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Native Language Dropdown */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Native Language</span>
                      </label>
                      <select
                        name="nativeLanguage"
                        value={profileData.nativeLanguage}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            nativeLanguage: e.target.value,
                          })
                        }
                        className="select select-bordered w-full"
                      >
                        <option value="">Select your native language</option>
                        {LANGUAGES.map((lang) => (
                          <option
                            key={`native-${lang}`}
                            value={lang.toLowerCase()}
                          >
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
                        value={profileData.learningLanguage}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            learningLanguage: e.target.value,
                          })
                        }
                        className="select select-bordered w-full"
                      >
                        <option value="">
                          Select language you're learning
                        </option>
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

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-base-content/70">
                        Full Name
                      </span>
                      <p className="text-base-content">{authUser?.fullName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-base-content/70">
                        Location
                      </span>
                      <p className="text-base-content">
                        {authUser?.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-base-content/70">
                      Bio
                    </span>
                    <p className="text-base-content">
                      {authUser?.bio || "No bio added yet"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-base-content/70">
                        Native Language
                      </span>
                      <p className="text-base-content">
                        {capitialize(authUser?.nativeLanguage) ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-base-content/70">
                        Learning Language
                      </span>
                      <p className="text-base-content">
                        {capitialize(authUser?.learningLanguage) ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <LockIcon className="size-5" />
                  Change Password
                </h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">
                        Current Password
                      </span>
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          New Password
                        </span>
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Confirm New Password
                        </span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending
                        ? "Changing..."
                        : "Change Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-base-content/70">
                  Keep your account secure by using a strong password.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
