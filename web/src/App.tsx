import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { JSX } from "react/jsx-runtime";

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
          <Route path="/" element={<Protected><Tasks /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}