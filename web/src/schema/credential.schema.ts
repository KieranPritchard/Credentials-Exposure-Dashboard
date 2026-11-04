import z from "zod";

// Defines the schema for credential
export const credentialSchema = z.object({
    email: z.email(),
    timesBreached: z.number().int().nonnegative().optional(),
    breachDetails: z.string().optional()
});