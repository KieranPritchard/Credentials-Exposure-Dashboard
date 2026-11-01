import { Edit3Icon, Trash } from "lucide-react";
import type { Credential } from "../../../types/Credential";
import { useState } from "react";
import { Modal } from "../Modal";

export default function CredentialTableRow({ credential }: { credential: Credential }): React.JSX.Element {
    // State for the two modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
                <p>Edit credential content here.</p>
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