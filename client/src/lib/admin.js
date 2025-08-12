import { axiosInstance } from "./axios";

export const getAllUsers = async () => {
  const { data } = await axiosInstance.get("/admins/users");
  return data.data;
};

export const createAdmin = async (adminData) => {
  const { data } = await axiosInstance.post("/admins", adminData);
  return data.data;
};

export const changeUserRole = async ({ id, role }) => {
  const { data } = await axiosInstance.put(`/admins/users/${id}/role`, {
    role,
  });
  return data.data;
};

export const suspendUser = async (id) => {
  const { data } = await axiosInstance.put(`/admins/users/${id}/suspend`);
  return data.data;
};

export const unsuspendUser = async (id) => {
  const { data } = await axiosInstance.put(`/admins/users/${id}/unsuspend`);
  return data.data;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/admins/users/${id}`);
  return data.data;
};

export const restoreUser = async (id) => {
  const { data } = await axiosInstance.put(`/admins/users/${id}/restore`);
  return data.data;
};
