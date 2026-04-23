import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactUsPage() {
  const navigate = useNavigate();

  const [type, setType] = useState("buy");

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    quantity: 1,
    location: "",
    message: ""
  });

  // RESET PRODUCT STATE WHEN TYPE CHANGES
  useEffect(() => {
    setSearch("");
    setResults([]);
    setSelectedProduct(null);
  }, [type]);

  // DEBOUNCED SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.length < 2) {
        setResults([]);
        return;
      }
      fetchProducts(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const fetchProducts = async (value) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/products/search?q=${value}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Search failed");

      setResults(data.data || []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      setError("Name and phone are required");
      return;
    }

    if (type === "buy" && !selectedProduct && search.length < 2) {
      setError("Please select or search a product");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_type: type,
          name: form.name,
          phone: form.phone,
          quantity: Number(form.quantity),
          location: form.location,
          message: form.message,
          product_id: selectedProduct?.id || null,
          product_name: selectedProduct?.name || search.trim() || null,
          is_custom_product: type === "buy" && !selectedProduct
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Submit failed");

      // RESET
      setForm({
        name: "",
        phone: "",
        quantity: 1,
        location: "",
        message: ""
      });

      setSearch("");
      setResults([]);
      setSelectedProduct(null);

      alert(`Request sent successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          <div>
            <h1 className="text-3xl font-bold">FixTech Requests</h1>
            <p className="text-zinc-400 mt-2">
              Buy products, request repairs, delivery or support.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["buy", "repair", "delivery", "support"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`p-4 rounded-xl border text-left transition ${
                  type === t
                    ? "bg-indigo-600 border-indigo-500"
                    : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                <p className="font-semibold capitalize">{t}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {t === "buy" && "Purchase electronics"}
                  {t === "repair" && "Fix devices"}
                  {t === "delivery" && "Home delivery"}
                  {t === "support" && "Technical help"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Create Request</h2>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← Home
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder="Full name"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              value={form.name}
              required
            />

            <input
              placeholder="Phone number"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              value={form.phone}
              required
            />

            {/* PRODUCT SEARCH */}
            {type === "buy" && (
              <div>
                <input
                  placeholder="Search product..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {loading && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Searching...
                  </p>
                )}

                {results.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="p-2 bg-zinc-800 mt-1 rounded cursor-pointer hover:bg-zinc-700"
                  >
                    {p.name}
                  </div>
                ))}

                {selectedProduct && (
                  <p className="text-green-400 text-sm mt-2">
                    Selected: {selectedProduct.name}
                  </p>
                )}
              </div>
            )}

            {type === "buy" && (
              <input
                type="number"
                min="1"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            )}

            {(type === "delivery" || type === "repair") && (
              <input
                placeholder="Location"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            )}

            <textarea
              placeholder="Message"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg"
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-medium transition ${
                submitting
                  ? "bg-indigo-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? "Processing..." : "Submit Request"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}