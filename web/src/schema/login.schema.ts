import z from "zod";
import { passwordSchema } from "./password.schema";

// Defines the schema to be used for logging in
export const loginSchema = z.object({
    email: z.email(),
    password: passwordSchema
})