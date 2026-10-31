import { FormProvider } from "../context/FormContext";
import * as z from "zod";
import { passwordSchema } from "../schema/password.schema";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import React from "react";

// Schema for resetting a password — mirrors the server-side ResetPasswordSchema
const forgotPasswordSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: passwordSchema
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export default function ForgotPassword(): React.JSX.Element {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200/80">
                <FormProvider
                    schema={forgotPasswordSchema}
                    initialValues={{ email: "", password: "", confirmPassword: "" }}
                >
                    <ForgotPasswordForm />
                </FormProvider>
            </div>
        </main>
    );
}