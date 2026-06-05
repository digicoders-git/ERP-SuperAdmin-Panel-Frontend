import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function LoginDebug() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("=== LOGIN DEBUG START ===");
      console.log("Request body:", { ...formData, panel: "superAdmin" });

      const result = await api.post("/api/admin/login", { 
        ...formData, 
        panel: "superAdmin" 
      });

      console.log("Full response:", result);
      console.log("Response data:", result.data);
      
      setResponse(result.data);
      
      if (result.data.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.admin));
        console.log("Login successful!");
      }
    } catch (err) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error object:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Login Debug</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="superadmin@gmail.com"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Error:</strong>
          <pre>{error}</pre>
        </div>
      )}

      {response && (
        <div style={{ color: "green", marginTop: "20px" }}>
          <strong>Response:</strong>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px" }}>
        <p>Open Browser Console (F12) to see detailed logs</p>
        <p>Check Network tab to see request/response</p>
      </div>
    </div>
  );
}

export default LoginDebug;
