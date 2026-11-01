import React from 'react';
import { Home, List} from 'lucide-react';

// Interface to store the nav item type
interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}

// Custom hook to manage dynamic navigation items
export const useNavItems:() => NavItem[] = (): NavItem[] => {
    return [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Credentials', path: '/credentials', icon: List },
    ];
};