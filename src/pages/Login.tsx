import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api/http";
import "./Register.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const result = await post("accounts/login/", {
      email,
      password,
    });

    if (result.success) {
      navigate("/chat");
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Login</h2>
        <p className="subtitle">Welcome back</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="login-link">
          New User?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}