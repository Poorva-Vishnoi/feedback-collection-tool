import { useEffect, useState } from "react";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";
import ChartSection from "./ChartSection";
import { io } from "socket.io-client";

export default function AdminDashboard({ token }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, totalFeedbacks: 0 });
  const [minRating, setMinRating] = useState("0");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("chart");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(() => localStorage.theme === "dark");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/feedback?minRating=${minRating}&sortBy=${sortBy}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/feedback?stats=true", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setFeedbacks(listRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [minRating, sortBy]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("new-feedback", fetchData);
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const filteredFeedbacks = feedbacks.filter((f) =>
    `${f.name} ${f.email} ${f.feedback}`.toLowerCase().includes(search)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Top Bar */}
      <div className="flex justify-end items-center gap-2 px-6 py-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800">

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-52 bg-gray-100 dark:bg-gray-800 p-4 space-y-4 border-r dark:border-gray-700">
          <h2 className="text-lg font-semibold">📋 Dashboard</h2>
          <button
            onClick={() => setSection("chart")}
            className={`w-full text-left px-2 py-1 rounded ${section === "chart" ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            📊 Chart View
          </button>
          <button
            onClick={() => setSection("stats")}
            className={`w-full text-left px-2 py-1 rounded ${section === "stats" ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            📈 Feedback Stats
          </button>
          <button
            onClick={() => setSection("entries")}
            className={`w-full text-left px-2 py-1 rounded ${section === "entries" ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          >
            💬 Feedback Entries
          </button>
          <a
            href="http://localhost:5000/api/feedback/export"
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
          >
            📥 Export CSV
          </a>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              className="border border-gray-300 px-3 py-1.5 rounded text-sm dark:bg-gray-800 dark:border-gray-600"
            />

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="0">All Ratings</option>
              <option value="3">Min 3 Stars</option>
              <option value="4">Min 4 Stars</option>
              <option value="5">Only 5 Stars</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="default">Newest</option>
              <option value="rating-asc">Rating Low to High</option>
              <option value="rating-desc">Rating High to Low</option>
            </select>

            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              🔁 Refresh
            </button>
          </div>

          {/* Feedback Stats */}
          {section === "stats" && (
            <div className="bg-white dark:bg-gray-800 shadow rounded p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2">📈 Feedback Stats</h2>
              <p>⭐ Avg Rating: {stats.avgRating.toFixed(2)}</p>
              <p>🧾 Total Feedbacks: {stats.totalFeedbacks}</p>
            </div>
          )}

          {/* Feedback Entries */}
          {section === "entries" && (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredFeedbacks.map((f, i) => (
                <div key={i} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
                  <div className="font-medium">{f.name || "Anonymous"}</div>
                  <div className="text-sm text-gray-600">{f.email || "No email"}</div>
                  <div className="my-2 text-sm">{f.feedback}</div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, j) => (
                      <StarIcon
                        key={j}
                        className={`w-4 h-4 ${j < f.rating ? "" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">{f.rating} stars</span>
                  </div>
                </div>
              ))}
              {filteredFeedbacks.length === 0 && (
                <p className="text-sm text-gray-500">No feedback found.</p>
              )}
            </div>
          )}

          {/* Chart View */}
          {section === "chart" && !loading && feedbacks.length > 0 && (
            <ChartSection feedbacks={feedbacks} />
          )}
        </div>
      </div>
    </div>
  );
}
