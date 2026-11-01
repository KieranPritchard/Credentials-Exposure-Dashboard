import { Edit3Icon, Trash } from "lucide-react";
import type { Credential } from "../../../types/Credential";

export default function CredentialTableRow({ credential }: { credential: Credential }): React.JSX.Element {
    return (
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
                >
                    <Edit3Icon className="w-5 h-5" />
                </button>
                <button
                    type="button"
                    className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    aria-label="Delete Credential"
                >
                    <Trash className="w-4 h-4" />
                </button>
            </td>
        </tr>
    )
}