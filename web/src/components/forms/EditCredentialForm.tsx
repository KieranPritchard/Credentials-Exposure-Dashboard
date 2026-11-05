import type { AxiosResponse } from "axios";
import axios from "axios";
import type { Credential } from "../../types/Credential";
import { api } from "../../lib/api";
import { useForm } from "../../context/FormContext";
import FormField from "./FormField";

// Props for the form
type EditCredentialFormProps = {
    // The credential being edited
    credential: Credential;
    // Closes the modal
    onClose: () => void;
}

export default function EditCredentialForm({ credential, onClose }: EditCredentialFormProps): React.JSX.Element {
    // Brings in the validation function from the context
    // This component renders inside the FormProvider, so the context exists here
    const { validateAll } = useForm();

    // Handler for editing a credential
    const handleEdit: (e: React.FormEvent) => Promise<void> = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Checks if the data is valid
        const { valid, data } = validateAll();

        // Checks if the data is valid, if not, return early
        if (!valid) {
            return;
        }

        try {
            // Sends a put request to axios
            const response: AxiosResponse = await api.put('/credentials', {
                id: credential.id,
                email: data.email,
                times_breached: data.timesBreached,
                breach_details: data.breachDetails
            }, {
                withCredentials: true
            });

            // Checks for the correct status code
            if (response.status !== 200) {
                throw new Error(`Failed to edit credential. Status code: ${response.status}`);
            }

            // Closes the modal
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Edit recipe failed:', error.response?.data?.message ?? error.message);
            } else {
                console.error('Unexpected error:', error);
            }

            // Closes the modal
            onClose();
        }
    };

    return (
        // Form for editing a credential
        <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-3">
                <FormField name="email" label="Email Address" type="email" />
                <FormField name="timesBreached" label="Times Breached" type="number" />
                <FormField name="breachDetails" label="Breach Details" type="text" />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full p-2 border border-slate-500 text-slate-600 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full p-2 border border-blue-600 text-blue-900 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                    Save
                </button>
            </div>
        </form>
    )
}