import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/requests");
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to load requests");

      setRequests(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((r) => r.request_type === filter);

  const badgeColor = (type) => {
    switch (type) {
      case "buy":
        return "bg-indigo-600";
      case "repair":
        return "bg-amber-600";
      case "delivery":
        return "bg-emerald-600";
      case "support":
        return "bg-pink-600";
      default:
        return "bg-zinc-600";
    }
  };

  return (
    <div className="p-6 space-y-6 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Requests</h1>
          <p className="text-zinc-500 text-sm">
            Manage all incoming service requests
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap">
        {["all", "buy", "repair", "delivery", "support"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              filter === t
                ? "bg-indigo-600 border-indigo-500"
                : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded">
          {error}
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="text-zinc-500">Loading requests...</div>
      ) : filtered.length === 0 ? (
        <div className="text-zinc-500">No requests found</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-zinc-500">{r.phone}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full text-white ${badgeColor(
                    r.request_type
                  )}`}
                >
                  {r.request_type}
                </span>
              </div>

              {/* BODY */}
              <div className="mt-3 text-sm text-zinc-300 space-y-1">
                {r.product_name && (
                  <p>
                    <span className="text-zinc-500">Product:</span>{" "}
                    {r.product_name}
                  </p>
                )}

                {r.quantity && (
                  <p>
                    <span className="text-zinc-500">Qty:</span> {r.quantity}
                  </p>
                )}

                {r.location && (
                  <p>
                    <span className="text-zinc-500">Location:</span>{" "}
                    {r.location}
                  </p>
                )}

                {r.message && (
                  <p>
                    <span className="text-zinc-500">Message:</span>{" "}
                    {r.message}
                  </p>
                )}
              </div>

              {/* FOOTER */}
              <div className="mt-3 text-xs text-zinc-500">
                {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}