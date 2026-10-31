import * as z from 'zod';

// Defines the password schema
export const passwordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password cannot exceed 20 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character." });