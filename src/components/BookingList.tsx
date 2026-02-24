import { useState, useEffect } from "react";
import { bookingsApi, getApiError, type Booking } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatBookingTime } from "./BookingForm";

interface BookingListProps {
  refreshKey?: number;
  startDate?: string;
  endDate?: string;
  userName?: string;
}

export default function BookingList({
  refreshKey = 0,
  startDate,
  endDate,
  userName,
}: BookingListProps) {
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const load = () => {
    setLoading(true);
    bookingsApi
      .list({ startDate, endDate, userName })
      .then(setList)
      .catch((err) => setError(getApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [refreshKey, startDate, endDate, userName]);

  const canDelete = (b: Booking) => {
    if (user?.role === "admin" || user?.role === "owner") return true;
    return b.userId === user?.id;
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await bookingsApi.delete(id);
      load();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error)
    return <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>;

  return (
    <ul className="space-y-2">
      {list.length === 0 ? (
        <li className="text-gray-500">No bookings yet.</li>
      ) : (
        list.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded"
          >
            <div>
              <span className="font-medium">
                {formatBookingTime(b.startTime)}
              </span>
              <span className="text-gray-500"> – </span>
              <span className="font-medium">
                {formatBookingTime(b.endTime)}
              </span>
              {b.user && (
                <span className="ml-2 text-gray-600">({b.user.name})</span>
              )}
            </div>
            {canDelete(b) && (
              <button
                type="button"
                onClick={() => handleDelete(b.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            )}
          </li>
        ))
      )}
    </ul>
  );
}
