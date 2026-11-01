import React, { useState } from 'react';
import {type NavigateFunction, NavLink, useNavigate} from 'react-router-dom';
import {
    LogOut, MenuIcon,
} from 'lucide-react';
import { useNavItems } from '../../hooks/NavItems';
import { api } from '../../lib/api';

export default function NavigationBar():React.JSX.Element {
    // Stores the state of the sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Brings in a navigate method
    const navigate:NavigateFunction = useNavigate()

    // Handler function to toggle the sidebar
    const toggleSidebar:() => void = ():void => {
        setIsCollapsed((prev:boolean):boolean => !prev);
    };

    // Handler function for the log out
    const handleLogout:() => void = async ():Promise<void> =>  {
        try {
            // A successful call (200 OK or 304 Not Modified) passes straight through
            await api.get("/logout", { withCredentials: true });

            navigate("/login")
        } catch (error) {
            // Unauthenticated (401/403) or network failure lands here
            console.error("Logout failed:", error);
        }
    }

    // Stores the navigation items
    const navItems = useNavItems();

    return (
        <aside
            className={`relative h-screen bg-blue-950 text-blue-100 transition-all duration-300 ease-in-out flex flex-col justify-between p-4 ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Top Section: Header & Toggle Button */}
            <div>
                <div className="flex items-center justify-between mb-8 px-2">
                    {!isCollapsed && (
                        <span className="text-xl font-bold tracking-wide text-blue-50">
                            Credential Manager
                        </span>
                    )}
                    <button
                        onClick={toggleSidebar}
                        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-900 text-blue-300 hover:text-blue-100 transition-colors ml-auto"
                    >
                        {isCollapsed ? <MenuIcon size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-blue-300/80 hover:bg-blue-900/50 hover:text-blue-100'
                                    }`
                                }
                            >
                                <Icon size={22} className="shrink-0" />
                                {!isCollapsed && (
                                    <span className="truncate transition-opacity duration-200">
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: Profile or Logout */}
            <div className="border-t border-emerald-900/80 pt-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-blue-300/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut size={22} className="shrink-0" />
                    {!isCollapsed && <span className="font-medium truncate">Logout</span>}
                </button>
            </div>
        </aside>
    );
};