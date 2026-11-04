import z from "zod";
import { passwordSchema } from "./password.schema";

// Defines the schema to be used for signing up
export const registerSchema = z.object({
    email: z.email(),
    displayName: z.string().min(1),
    password: passwordSchema,
    confirmPassword: passwordSchema
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})