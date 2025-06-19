import { useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  return (
    <div className="p-4">
      {token ? (
        <AdminDashboard token={token} />
      ) : (
        <AdminLogin onLoginSuccess={setToken} />
      )}
    </div>
  );
}
