import { useState } from "react";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";

export default function FeedbackForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedback: "",
    rating: 0,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (index) => {
    setForm({ ...form, rating: index + 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.feedback || form.rating < 1) {
      setError("Please provide feedback and select a rating.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/feedback/add", form);
      setSubmitted(true);
      setForm({ name: "", email: "", feedback: "", rating: 0 });
    } catch (err) {
      setError("Something went wrong while submitting.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-6 bg-green-100 rounded-md max-w-md mx-auto mt-8">
        <h2 className="text-xl font-semibold text-green-800">Thank you for your feedback!</h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4 bg-white p-6 rounded-md shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name (optional)
        </label>
        <input
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email (optional)
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="feedback" className="block text-sm font-medium mb-1">
          Your Feedback *
        </label>
        <textarea
          name="feedback"
          id="feedback"
          value={form.feedback}
          onChange={handleChange}
          required
          placeholder="Write your feedback here..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Rating *</label>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-6 h-6 cursor-pointer transition ${
                i < form.rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => handleRating(i)}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Feedback
      </button>
    </form>
  );
}
