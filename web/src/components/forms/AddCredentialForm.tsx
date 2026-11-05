import axios from "axios"
import { api } from "../../lib/api"
import { useForm } from "../../context/FormContext"
import FormField from "./FormField"

// Props for the form
type AddCredentialFormProps = {
    // Closes the modal
    onClose: () => void
}

export default function AddCredentialForm({ onClose }: AddCredentialFormProps) {
    // Brings in the validation function from the context
    // This component renders inside the FormProvider, so the context exists here
    const { validateAll } = useForm();

    // Handler for adding a new credential
    const handleAddCredential: (e: React.FormEvent) => Promise<void> = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()

        // Checks if the data is valid
        const { valid, data } = validateAll()

        // Checks if the data is valid, if not, return early
        if (!valid) {
            return
        }

        try {
            // Sends a post request to axios
            const response = await api.post('/credentials', {
                email: data.email,
            }, {
                withCredentials: true
            })

            // Checks for the correct status code
            if (response.status !== 201) {
                throw new Error(`Failed to add credential. Status code: ${response.status}`)
            }

            // Closes the modal
            onClose()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Add credential failed:', error.response?.data?.message ?? error.message)
            } else {
                console.error('Unexpected error:', error)
            }

            // Closes the modal
            onClose()
        }
    }

    return (
        // Form for adding a new credential
        <form onSubmit={handleAddCredential} className="space-y-4">
            <div className="space-y-3">
                <FormField name="email" label="Email Address" type="email" />
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