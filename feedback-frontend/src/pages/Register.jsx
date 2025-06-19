import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("http://localhost:5000/api/admin/register", form);
            setSuccess("Registration successful. You can now log in.");
            setTimeout(() => navigate("/admin"), 1500);
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed.";
            setError(msg);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 border border-gray-300 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Register</h2>

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
                        <strong>Success:</strong> {success}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Register
                </button>

                <p className="text-sm mt-2 text-center">
                    Already have an account?{" "}
                    <Link to="/admin" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
}
