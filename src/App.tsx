import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Base from "./pages/base";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Base />} /> */}
        <Route path="/chat" element={<ProtectedRoute><Base /></ProtectedRoute> } /></Routes>
    </BrowserRouter>
  );
}

export default App;