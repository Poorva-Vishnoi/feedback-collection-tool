import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ChartSection({ feedbacks }) {
  // Prepare data: count how many feedbacks for each rating (1 to 5)
  const ratingCount = [1, 2, 3, 4, 5].map((star) => ({
    rating: `${star} Star`,
    count: feedbacks.filter((f) => f.rating === star).length,
  }));

  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">📊 Feedback Distribution</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={ratingCount}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
