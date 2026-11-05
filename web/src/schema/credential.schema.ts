import z from "zod";

// Defines the schema for credential
export const credentialSchema = z.object({
    email: z.string().email(),
    timesBreached: z.coerce.number().int().nonnegative().optional(),
    breachDetails: z.string().optional(),
});
