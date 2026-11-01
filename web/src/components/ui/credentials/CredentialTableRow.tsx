import { Edit3Icon, Trash } from "lucide-react";
import type { Credential } from "../../../types/Credential";
import { useState } from "react";
import { Modal } from "../Modal";
import { api } from "../../../lib/api";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { z } from "zod";
import { FormProvider, useForm } from "../../../context/FormContext";
import FormField from "../../forms/FormField";

// Defines the schema for credential
const credentialSchema = z.object({
    email: z.string(),
    timesBreached: z.number().int().nonnegative(),
    breachDetails: z.string()
});

export default function CredentialTableRow({ credential }: { credential: Credential }): React.JSX.Element {
    // Brings in the validation function from the context
    const { validateAll } = useForm();
    
    // State for the two modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
            setIsEditModalOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Edit recipe failed:', error.response?.data?.message ?? error.message);
            } else {
                console.error('Unexpected error:', error);
            }

            // Closes the modal
            setIsEditModalOpen(false);
        }
    };

    // Handler for deleting a credential
    const handleDelete:()=>void = async ():Promise<void> => {
        try{
            // Sends a delete request to axios
            const response:AxiosResponse = await api.delete('/credentials', {
                data: {
                    id: credential.id
                },
                withCredentials: true
            })

            // Checks for the correct status code
            if (response.status !== 200) {
                throw new Error(`Failed to delete credential. Status code: ${response.status}`);
            }

            // Closes the modal
            setIsDeleteModalOpen(false)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Delete recipe failed:', error.response?.data?.message ?? error.message);
            } else {
                console.error('Unexpected error:', error);
            }

            // Closes the modal
            setIsDeleteModalOpen(false)
        }
    }

    return (
        <>
            <tr key={credential.id}>
                <td className="px-6 py-4">{credential.email}</td>
                <td className="px-6 py-4">{credential.timesBreached}</td>
                <td className="px-6 py-4">{JSON.stringify(credential.breachDetails)}</td>
                <td className="px-6 py-4">{credential.createdAt}</td>
                <td className="px-6 py-4">{credential.updatedAt}</td>
                <td className="px-6 py-4">
                    <button
                        type="button"
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="Edit Credential"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <Edit3Icon className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete Credential"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </td>
            </tr>

            {/* Edit Credential Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Credential"
            >
                <FormProvider schema={credentialSchema} initialValues={{ email: credential.email, timesBreached: credential.timesBreached, breachDetails: JSON.stringify(credential.breachDetails) }}>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-3">
                            <FormField name="email" label="Email Address" type="email" />
                            <FormField name="timesBreached" label="Times Breached" type="number" />
                            <FormField name="breachDetails" label="Breach Details" type="text" />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
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
                </FormProvider>
            </Modal>

            {/* Delete Credential Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Credential"
            >
                <p className="my-2">
                    Are you sure you want to delete this credential?
                </p>

                <div className="flex justify-between gap-2 pt-3 border-t border-slate-100">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="w-full p-2 border border-slate-500 text-slate-600 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full p-2 border border-rose-600 text-rose-900 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </>
    )
}