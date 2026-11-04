import z from "zod";
import { passwordSchema } from "./password.schema";

export const forgotPasswordSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: passwordSchema
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})