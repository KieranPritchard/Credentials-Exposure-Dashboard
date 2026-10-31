import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import FormField from "../forms/FormField";
import axios from "axios";
import React, { useState } from "react";
import { api } from "../../lib/api";
import { CheckCircle, CircleX } from "lucide-react";

export default function ForgotPasswordForm() {
    // Brings in the validation function from the context
    const { validateAll } = useForm();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handler function for submitting the form
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        // Checks if the data is valid
        const { valid, data } = validateAll();

        // Checks if the data is valid
        if (valid) {
            setIsLoading(true);
            try {
                // Sends the reset request to the server
                const response = await api.post('/reset-password', data, {
                    withCredentials: true
                });

                console.log('Password reset successful:', response.data);
                setSuccessMessage(response.data.message);

                // Navigate to login after a short delay so the user can read the message
                setTimeout(() => navigate("/login"), 2500);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.response?.data?.message ?? "Something went wrong. Please try again.");
                    console.error('Password reset failed:', error.response?.data?.message ?? error.message);
                } else {
                    setErrorMessage("An unexpected error occurred.");
                    console.error('Unexpected error:', error);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Header showing what the page is about */}
            <div className="mb-6">
                <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Reset Password</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Enter your email and choose a new password.
                </p>
            </div>

            {/* Success banner */}
            {successMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"/>
                    <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
                </div>
            )}

            {/* Error banner */}
            {errorMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-sm font-medium text-red-600">{errorMessage}</p>
                </div>
            )}

            {/* Form fields */}
            <div className="space-y-3">
                <FormField name="email" label="Email Address" type="email" />
                <FormField name="password" label="New Password" type="password" />
                <FormField name="confirmPassword" label="Confirm New Password" type="password" />
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
                {isLoading ? "Resetting…" : "Reset Password"}
            </button>

            {/* Back to login */}
            <p className="text-center text-sm text-slate-600 pt-3 border-t border-slate-100">
                Remembered your password?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}