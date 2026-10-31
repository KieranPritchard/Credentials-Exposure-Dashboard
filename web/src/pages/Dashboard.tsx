import { useEffect, useState } from "react"
import NavigationBar from "../components/ui/NavigationBar"
import { api } from "../lib/api"
import { useNavigate, type NavigateFunction } from "react-router-dom"

export default function Dashboard() {
    // Stores the status of whether the dashboard has loaded or not
    const [loading, setLoading] = useState(true)

    // Stores the data
    const [data, setData] = useState([])

    // Brings in a navigation method
    const navigate:NavigateFunction = useNavigate();
    
    // Fetches the data from the laravel backend
    useEffect(() => {
        let isMounted:boolean = true

        const fetchData = async () => {
            try{
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

                    // Sets the credentials recipe
                    setData(credentialData)
                    setLoading(false)
                }
            } catch (error) {
                // Logs the error to the console
                console.log(error);
                // Redirects the user to the login page
                navigate("/login");
            }
        }

        fetchData().then(() => {})
        
        return ():void => {
            isMounted = false
        }
    }, [navigate])

    return (
        <main className="min-h-screen flex overflow-x-clip">
            
            <NavigationBar />

            <div className="flex-1 flex flex-col items-center bg-slate-50 text-slate-800 px-4 py-12">
                {/* Displays a spinner when loading */}
                {loading && (
                    <div id="spinner" className={loading ? "hidden flex-col items-center gap-3" : "flex flex-col items-center gap-3"}>
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500">
                            Waiting on credential data...
                        </p>
                    </div>
                )}

                {/* Displays the main page when the spinner is not there */}
                {!loading && (
                    <div className="w-full max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                            
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}