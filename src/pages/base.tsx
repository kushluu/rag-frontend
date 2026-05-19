import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Base() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Chat Page</h1>
    </div>
  );
}