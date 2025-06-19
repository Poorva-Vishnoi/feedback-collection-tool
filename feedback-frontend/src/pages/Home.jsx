import FeedbackForm from "@/components/FeedbackForm";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Submit Your Feedback</h1>
      <FeedbackForm />

      <div className="text-center mt-6">
        <Link to="/admin" className="text-sm text-blue-600 hover:underline">
          Admin Login
        </Link>
      </div>
    </div>
  );
}
