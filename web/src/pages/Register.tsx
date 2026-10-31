import { FormProvider } from "../context/FormContext";
import * as z from "zod"
import { passwordSchema } from "../schema/password.schema";
import RegisterForm from "../components/auth/RegisterForm";
import React from "react"

// Defines the schema to be used for signing up
const signUpSchema = z.object({
    email: z.email(),
    displayName: z.string().min(1),
    password: passwordSchema,
    confirmPassword: passwordSchema
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export default function SignUp():React.JSX.Element {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200/80">
                <FormProvider schema={signUpSchema} initialValues={{email: "", displayName: "", password: "", confirmPassword: ""}}>
                    <RegisterForm />
                </FormProvider>
            </div>
        </main>
    )
}