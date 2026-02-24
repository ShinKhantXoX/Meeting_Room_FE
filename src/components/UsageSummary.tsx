import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { bookingsApi, getApiError } from "../api";

interface SummaryItem {
  userId: string;
  user: { id: string; name: string; role: string } | null;
  totalBookings: number;
}

export default function UsageSummary() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bookingsApi
      .summary()
      .then(setSummary)
      .catch((err) => setError(getApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>{t("summary.loadingSummary")}</p>;
  if (error)
    return <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>;

  return (
    <table className="w-full border-collapse bg-white border border-gray-200 rounded">
      <thead>
        <tr className="bg-gray-50">
          <th className="text-left p-3 border-b">{t("summary.user")}</th>
          <th className="text-left p-3 border-b">{t("users.role")}</th>
          <th className="text-left p-3 border-b">
            {t("summary.totalBookings")}
          </th>
        </tr>
      </thead>
      <tbody>
        {summary.map((s) => (
          <tr key={s.userId} className="border-b border-gray-100">
            <td className="p-3">{s.user?.name ?? s.userId}</td>
            <td className="p-3">{s.user?.role ?? "—"}</td>
            <td className="p-3">{s.totalBookings}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
