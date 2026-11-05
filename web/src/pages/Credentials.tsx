import { useEffect, useState } from "react"
import { useNavigate, type NavigateFunction } from "react-router-dom"
import type { Credential } from "../types/Credential"
import { api } from "../lib/api"
import NavigationBar from "../components/ui/NavigationBar"
import CredentialTableRow from "../components/ui/credentials/CredentialTableRow"
import { Plus } from "lucide-react"
import { Modal } from "../components/ui/Modal"
import { FormProvider } from "../context/FormContext"
import { credentialSchema } from "../schema/credential.schema"
import AddCredentialForm from "../components/forms/AddCredentialForm"

export default function Credentials() {
    // Stores the status of the loading data
    const [loading, setLoading] = useState(true)
    
    // Stores the data
    const [credentials, setCredentials] = useState<Credential[]>([])

    // Handles the state of the modal
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Brings in a navigation method
    const navigate: NavigateFunction = useNavigate()

    // Fetches the data from the laravel backend
    useEffect(() => {
        let isMounted: boolean = true

        const fetchData = async () => {
            try {
                // Gets the response from the api
                const response = await api.get("/credentials")

                // Checks if the response was ok
                if (response.status < 200 || response.status >= 300) {
                    navigate("/login")
                    return
                }

                // Checks if the page is mounted
                if (isMounted) {
                    // Stores the credentials data
                    const credentialData = response.data

                    // Sets the credentials data
                    setCredentials(credentialData)
                    setLoading(false)
                }
            } catch (error) {
                // Logs the error to the console
                console.log(error)
                // Redirects the user to the login page
                navigate("/login")
            }
        }

        fetchData().then(() => {})

        return (): void => {
            isMounted = false
        }
    }, [navigate])

    return (
        <main className="min-h-screen flex overflow-x-clip">

            <NavigationBar />

            <div className="flex-1 flex flex-col items-center bg-slate-50 text-slate-800 px-4 py-12">
                {/* Displays a spinner when loading */}
                {loading && (
                    <div id="spinner" className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500">
                            Waiting on credential data...
                        </p>
                    </div>
                )}

                {/* Displays the main page when the spinner is not there */}
                {!loading && (
                    <div className="w-full max-w-6xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-6">Credentials</h1>
                        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                            {/* Table for displaying credentials */}
                            <table className="w-full text-left text-sm text-slate-500">
                                <thead className="bg-blue-100 text-xs uppercase tracking-wider text-slate-700">
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Times Breached</th>
                                    <th scope="col" className="px-6 py-3">Breach Details</th>
                                    <th scope="col" className="px-6 py-3">Created At</th>
                                    <th scope="col" className="px-6 py-3">Updated At</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </thead>
                                <tbody className="divide-y divide-blue-100 text-blue-800">
                                    {!loading && credentials.map((credential: Credential) => (
                                        <CredentialTableRow key={credential.id} credential={credential} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Button to add a new credential */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                type="button"
                                className="px-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 inline-block mr-2" />
                                Add Credential
                            </button>
                        </div>

                        {/* Modal for adding a new credential */}
                        <Modal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="Add Credential"
                        >
                            {/* Form for adding a new credential, rendered inside the provider so useForm works */}
                            <FormProvider schema={credentialSchema} initialValues={{ email: ""}}>
                                <AddCredentialForm onClose={() => setIsModalOpen(false)} />
                            </FormProvider>

                        </Modal>
                    </div>
                )}
            </div>
        </main>
    )
}