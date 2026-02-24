import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { bookingsApi, getApiError } from "../api";
import { formatBookingTime } from "../components/BookingForm";
import UsageSummary from "../components/UsageSummary";

type GroupedItem = {
  userId: string;
  user: { id: string; name: string; role: string };
  bookings: {
    id: string;
    startTime: string;
    endTime: string;
    userId: string;
  }[];
};

export default function SummaryPage() {
  const { t, i18n } = useTranslation();
  const [grouped, setGrouped] = useState<GroupedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = i18n.language;

  useEffect(() => {
    bookingsApi
      .listGroupedByUser()
      .then(setGrouped)
      .catch((err) => setError(getApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{t("summary.title")}</h1>
      <UsageSummary />
      <h2 className="text-lg font-medium mt-8 mb-3">
        {t("summary.bookingsByUser")}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <p>{t("summary.loading")}</p>
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => (
            <div
              key={g.userId}
              className="bg-white border border-gray-200 rounded p-4"
            >
              <h3 className="font-medium text-gray-900 mb-2">{g.user.name}</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {g.bookings.map((b) => (
                  <li key={b.id}>
                    {formatBookingTime(b.startTime, locale)} –{" "}
                    {formatBookingTime(b.endTime, locale)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
