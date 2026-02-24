import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authApi } from "../api";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";
import type { User } from "../api";

export default function LoginPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .listUsersForLogin()
      .then(setUsers)
      .catch(() => setError(t("login.failedToLoad")))
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
        setError(err.response?.data?.error?.message ?? t("login.loginFailed"));
      });
  };

  if (user) return null;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">{t("login.title")}</h1>
      <p className="text-gray-600 mb-4">{t("login.selectUser")}</p>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <p>{t("login.loadingUsers")}</p>
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
