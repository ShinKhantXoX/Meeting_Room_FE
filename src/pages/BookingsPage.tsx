import { useCallback, useState } from "react";
import { bookingsApi, getApiError } from "../api";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";

export default function BookingsPage() {
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
      <h1 className="text-xl font-semibold mb-4">Bookings</h1>
      <BookingForm
        onSubmit={handleCreate}
        error={createError}
        clearError={() => setCreateError(null)}
      />
      <BookingList refreshKey={refreshKey} />
    </div>
  );
}
