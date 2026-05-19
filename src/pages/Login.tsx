import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api/http";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) setEmailError("");
    else if (!email.includes("@")) setEmailError("Invalid email format");
    else setEmailError("");
  }, [email]);

  const isFormValid = email && password && !emailError;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) return;

    setLoading(true);

    const result = await post("accounts/login/", {
      email: email.trim(),
      password,
    });

    if (result.success) {
      await checkAuth();
      navigate("/chat", { replace: true });
    } else {
      if (result.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoFocus
          />

          {emailError && <div className="field-error">{emailError}</div>}

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-link">
          New user?{" "}
          <span onClick={() => navigate("/register", { replace: true })}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}