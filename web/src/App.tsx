import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { JSX } from "react/jsx-runtime";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function Protected({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading…</p>;
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/forgot-password" element={<Protected><ForgotPassword /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}