import { FormProvider } from "../context/FormContext";
import RegisterForm from "../components/auth/RegisterForm";
import React from "react"
import { registerSchema } from "../schema/register.schema";

export default function Register():React.JSX.Element {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200/80">
                <FormProvider schema={registerSchema} initialValues={{email: "", displayName: "", password: "", confirmPassword: ""}}>
                    <RegisterForm />
                </FormProvider>
            </div>
        </main>
    )
}