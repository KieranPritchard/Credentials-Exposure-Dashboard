import axios from "axios";

export function fieldErrors(err: unknown): Record<string, string> {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
        const raw = err.response.data.errors as Record<string, string[]>;
        return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]]));
    }
    return { form: "Something went wrong. Try again." };
}

// In a form:
// try { await login(email, password); }
// catch (e) { setErrors(fieldErrors(e)); }   // then show errors.email, errors.password