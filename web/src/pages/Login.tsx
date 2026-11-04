import LoginForm from "../components/auth/LoginForm";
import { FormProvider } from "../context/FormContext";
import { loginSchema } from "../schema/login.schema";
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login():React.JSX.Element {
    const { user, loading } = useAuth();

    // Once user state is set (after login), redirect reactively.
    // This avoids the race where navigate() fires before setUser() commits.
    if (!loading && user) return <Navigate to="/dashboard" replace />;

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200/80">
                <FormProvider schema={loginSchema} initialValues={{email: "", password: ""}}>
                    <LoginForm />
                </FormProvider>
            </div>
        </main>
    )
}