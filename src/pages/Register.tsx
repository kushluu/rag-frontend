import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api/http";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [username, setUsername] = useState("");
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

  const isFormValid = username && email && password && !emailError;

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) return;

    setLoading(true);

    const result = await post("accounts/register/", {
      username: username.trim(),
      email: email.trim(),
      password,
    });

    if (result.success) {
      await checkAuth();
      navigate("/chat", { replace: true });
    } else {
      if (result.status === 400) {
        setError("User already exists or invalid input");
      } else {
        setError("Something went wrong. Try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Start your AI chat experience</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            autoFocus
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="switch-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/", { replace: true })}>Login</span>
        </p>
      </div>
    </div>
  );
}