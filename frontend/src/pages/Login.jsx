import { useState } from "react";
import axios from "../api/axios"; // ✅ central instance
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });

      // Save token and update context
      localStorage.setItem("token", res.data.token);
      login({ username: res.data.username });

      setSuccess("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h3>Login</h3>

        {loading && <LoadingSpinner text="Logging you in..." />}
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
