import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { User } from "../types/User";
import type { AuthValue } from "../types/AuthValue";

// Creates a new context
const AuthContext = createContext<AuthValue>(null!);

// Creates a hook to use a context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Stores the user
    const [user, setUser] = useState<User | null>(null);

    // Stores the status of the page that is loading
    const [loading, setLoading] = useState(!!localStorage.getItem("token"));

    // On page load, restore the session if a token exists
    useEffect(() => {
        if (!localStorage.getItem("token")) return;
        api.get<User>("/me").then((r) => setUser(r.data)).finally(() => setLoading(false));
    }, []);

    // Function to handle log ins
    async function login(email: string, password: string) {
        const { data } = await api.post("/login", { email, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    // Function to handle log out
    async function logout() {
        await api.post("/logout").catch(() => {});
        localStorage.removeItem("token");
        setUser(null);
    }

    // Returns the context provider
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}