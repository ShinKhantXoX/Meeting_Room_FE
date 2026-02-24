import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";
import type { User } from "../api";

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .listUsersForLogin()
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSelect = (u: User) => {
    setError(null);
    authApi
      .login({ userId: u.id })
      .then(({ token, user: u2 }) => {
        login(u2, token);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setError(err.response?.data?.error?.message ?? "Login failed");
      });
  };

  if (user) return null;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Meeting Room Booking</h1>
      <p className="text-gray-600 mb-4">Select a user to sign in</p>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => handleSelect(u)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <span>{u.name}</span>
                <RoleBadge role={u.role} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
