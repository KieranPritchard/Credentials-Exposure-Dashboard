import { FormProvider } from "../context/FormContext";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import React from "react";
import { forgotPasswordSchema } from "../schema/forgot-password.schema";

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