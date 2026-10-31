import LoginForm from "../components/auth/LoginForm";
import { FormProvider } from "../context/FormContext";
import * as z from "zod"
import { passwordSchema } from "../schema/password.schema";
import React from "react";

// Defines the schema to be used for logging in
const loginSchema = z.object({
    email: z.email(),
    password: passwordSchema
})

export default function Login():React.JSX.Element {
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