import { useMutation } from "@tanstack/react-query";
import { createAdmin } from "../../lib/admin";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import { useState } from "react";

const CreateAdminPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  const createAdminMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      handleToastSuccess("Admin created successfully");
      setFormData({ email: "", fullName: "", password: "" });
    },
    onError: handleToastError,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createAdminMutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Admin</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={createAdminMutation.isPending}
        >
          {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdminPage;
