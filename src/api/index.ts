import axios from "axios";
import { api } from "./client";

const client = axios.create({
  baseURL: api.baseURL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = api.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      api.clearToken();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(err);
  },
);

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Booking {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  user?: { id: string; name: string; role?: string };
}

export const authApi = {
  listUsersForLogin: () =>
    client.get<User[]>("/api/auth/users").then((r) => r.data),
  login: (body: { userId?: string; name?: string }) =>
    client
      .post<{ token: string; user: User }>("/api/auth/login", body)
      .then((r) => r.data),
  me: () => client.get<User>("/api/auth/me").then((r) => r.data),
};

export const usersApi = {
  list: () => client.get<User[]>("/api/users").then((r) => r.data),
  create: (data: { name: string; role: string }) =>
    client.post<User>("/api/users", data).then((r) => r.data),
  updateRole: (id: string, role: string) =>
    client.patch<User>(`/api/users/${id}`, { role }).then((r) => r.data),
  delete: (id: string) => client.delete(`/api/users/${id}`),
};

export const bookingsApi = {
  list: () => client.get<Booking[]>("/api/bookings").then((r) => r.data),
  listGroupedByUser: () =>
    client
      .get<
        { userId: string; user: User; bookings: Booking[] }[]
      >("/api/bookings?groupBy=user")
      .then((r) => r.data),
  summary: () =>
    client
      .get<
        { userId: string; user: User | null; totalBookings: number }[]
      >("/api/bookings/summary")
      .then((r) => r.data),
  create: (data: { startTime: string; endTime: string }) =>
    client.post<Booking>("/api/bookings", data).then((r) => r.data),
  delete: (id: string) => client.delete(`/api/bookings/${id}`),
};

export function getApiError(err: unknown): { code: string; message: string } {
  if (axios.isAxiosError(err) && err.response?.data?.error) {
    return err.response.data.error;
  }
  return {
    code: "UNKNOWN",
    message: err instanceof Error ? err.message : "Something went wrong",
  };
}
