import { Link } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import FormField from "../forms/FormField";
import axios from "axios"
import React from "react";
import { useAuth } from "../../context/AuthContext";

type LoginData = { email: string; password: string };

export default function LoginForm():React.JSX.Element {
    // Brings in the validation function from the context
    const { validateAll } = useForm<LoginData>();
    const { login } = useAuth();

    // Handler function for submitting the form
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Checks if the data is valid
        const { valid, data } = validateAll();
        if (valid) {
            try {
                // Use AuthContext login() — stores token AND sets user state.
                // Login.tsx watches user state and redirects reactively.
                await login(data.email, data.password);
            } catch (error) {
                // Checks and displays the correct errors
                if (axios.isAxiosError(error)) {
                    console.error('Login failed:', error.response?.data?.message ?? error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Header showing what the page is about */}
            <div className="mb-6">
                <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Sign In</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Enter your credentials to access your account.
                </p>
            </div>

            {/* Form details */}
            <div className="space-y-3">
                <FormField name="email" label="Email Address" type="email" />
                
                <div>
                    <FormField name="password" label="Password" type="password" />
                    <div className="flex justify-end -mt-2">
                        <Link
                            to="/forgot-password" 
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>

            {/* Button to allow for the user to submit the data */}
            <button 
                type="submit" 
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
                Login
            </button>

            {/* Allows the user to go and create an account */}
            <p className="text-center text-sm text-slate-600 pt-3 border-t border-slate-100">
                Don't have an account?{" "}
                <Link 
                    to="/register" 
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                    Create account
                </Link>
            </p>
        </form>
    );
}