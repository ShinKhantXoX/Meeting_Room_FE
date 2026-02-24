import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterX } from "lucide-react";
import { bookingsApi, getApiError } from "../api";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";

export default function BookingsPage() {
  const { t } = useTranslation();
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState("");

  const handleClearFilters = useCallback(() => {
    setStartDate("");
    setEndDate("");
    setUserName("");
  }, []);

  const handleCreate = useCallback(
    async (startTime: string, endTime: string) => {
      setCreateError(null);
      try {
        await bookingsApi.create({ startTime, endTime });
        setRefreshKey((k) => k + 1);
      } catch (err) {
        setCreateError(getApiError(err).message);
        throw err;
      }
    },
    [],
  );

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{t("bookings.title")}</h1>
      <BookingForm
        onSubmit={handleCreate}
        error={createError}
        clearError={() => setCreateError(null)}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {t("bookings.startDate")}
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t("bookings.endDate")}</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {t("bookings.userName")}
          </span>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t("bookings.searchPlaceholder")}
            className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[160px]"
          />
        </label>
        <button
          type="button"
          onClick={handleClearFilters}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <FilterX size={16} />
          {t("bookings.clear")}
        </button>
      </div>
      <BookingList
        refreshKey={refreshKey}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        userName={userName.trim() || undefined}
      />
    </div>
  );
}
