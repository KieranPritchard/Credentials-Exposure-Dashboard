import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import FormField from "../forms/FormField";
import { api } from "../../lib/api";
import type React from "react";
import axios from "axios";

export default function RegisterForm() {
    // Brings in the form functions
    const {validateAll} = useForm()
    const navigate = useNavigate()

    // Handler function for submitting the form
    const onSubmit = async (e:React.FormEvent) => {
        e.preventDefault()

        // Checks if the data is valid
        const { valid, data } = validateAll()

        // Checks if the data is valid
        if (valid) {
            try {
                // Sends the new user data for adding to the users
                const response = await api.post('/register', data, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

                // logs in the sign in as successful
                console.log('Sign up successful:', response.data);

                // Navigates to the login
                navigate("/login");
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Sign up failed:', error.response?.data?.message ?? error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Header showing what the page is about */}
            <div className="mb-6">
                <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Sign Up</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Enter your credentials to create your account.
                </p>
            </div>

            {/* Form details */}
            <div className="space-y-3">
                <FormField name="email" label="Email Address" type="email" />
                <FormField name="displayName" label="Display Name" type="text" />
                <FormField name="password" label="Password" type="password" />
                <FormField name="confirmPassword" label="Confirm Password" type="password" />
            </div>

            {/* Button to allow for the user to submit the data */}
            <button 
                type="submit" 
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
                Sign Up
            </button>

            {/* Allows the user to go and create an account */}
            <p className="text-center text-sm text-slate-600 pt-3 border-t border-slate-100">
                Already have an account?{" "}
                <Link 
                    to="/login" 
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                    Login
                </Link>
            </p>
        </form>
    )
}