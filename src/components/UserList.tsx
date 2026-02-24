import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, UserPlus } from "lucide-react";
import { usersApi, getApiError, type User } from "../api";

export default function UserList() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"user" | "owner" | "admin">("user");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    usersApi
      .list()
      .then(setUsers)
      .catch((err) => setError(getApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await usersApi.create({ name: newName.trim(), role: newRole });
      setNewName("");
      setNewRole("user");
      load();
    } catch (err) {
      setError(getApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await usersApi.delete(id);
      load();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    setError(null);
    try {
      await usersApi.updateRole(id, role);
      load();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  if (loading) return <p>{t("users.loading")}</p>;

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <form
        onSubmit={handleCreate}
        className="mb-6 p-4 bg-white rounded border flex flex-wrap items-end gap-4"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">{t("users.name")}</span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5"
            placeholder={t("users.newUserPlaceholder")}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">{t("users.role")}</span>
          <select
            value={newRole}
            onChange={(e) =>
              setNewRole(e.target.value as "user" | "owner" | "admin")
            }
            className="border border-gray-300 rounded px-2 py-1.5"
          >
            <option value="user">{t("roles.user")}</option>
            <option value="owner">{t("roles.owner")}</option>
            <option value="admin">{t("roles.admin")}</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <UserPlus size={16} />
          {t("users.addUser")}
        </button>
      </form>
      <table className="w-full border-collapse bg-white border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-3 border-b">{t("users.name")}</th>
            <th className="text-left p-3 border-b">{t("users.role")}</th>
            <th className="text-left p-3 border-b">{t("users.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-100">
              <td className="p-3">{u.name}</td>
              <td className="p-3">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="user">{t("roles.user")}</option>
                  <option value="owner">{t("roles.owner")}</option>
                  <option value="admin">{t("roles.admin")}</option>
                </select>
              </td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => handleDelete(u.id)}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash2 size={16} />
                  {t("bookings.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
