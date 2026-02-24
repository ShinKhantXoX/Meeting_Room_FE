import { useState } from "react";

interface BookingFormProps {
  onSubmit: (startTime: string, endTime: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function BookingForm({
  onSubmit,
  error,
  clearError,
}: BookingFormProps) {
  const now = new Date();
  const defaultStart = new Date(now.getTime() + 60 * 60 * 1000);
  defaultStart.setMinutes(0, 0, 0);
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000);

  const [start, setStart] = useState(toLocalISO(defaultStart));
  const [end, setEnd] = useState(toLocalISO(defaultEnd));
  const [submitting, setSubmitting] = useState(false);
  const [invalidRangeMessage, setInvalidRangeMessage] = useState<string | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setInvalidRangeMessage(null);
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate >= endDate) {
      setInvalidRangeMessage(
        "End date and time must be after start date and time.",
      );
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(startDate.toISOString(), endDate.toISOString());
      setStart(toLocalISO(defaultStart));
      setEnd(toLocalISO(defaultEnd));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {invalidRangeMessage && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded border border-gray-200 bg-white p-4 shadow-lg">
            <p className="mb-4 text-gray-800">{invalidRangeMessage}</p>
            <button
              type="button"
              onClick={() => setInvalidRangeMessage(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 bg-white rounded border border-gray-200"
      >
        <h2 className="font-medium mb-3">New booking</h2>
        {error && (
          <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Start</span>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">End</span>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5"
              required
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </>
  );
}

export function formatBookingTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}
