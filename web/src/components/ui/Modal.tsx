import React, {useEffect} from 'react'
import {XIcon} from "lucide-react"

// Interface for the modal props
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({isOpen, onClose, title, children}:ModalProps):React.JSX.Element | null {
    
    // Use effect to close on the escape key
    useEffect(():() => void => {
        // Handler function to handle the escape key
        const handleEsc:(e:KeyboardEvent) => void = (e:KeyboardEvent):void => {
            // Checks if the key is escape
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return ():void => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Use effect to stop scrolling
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal panel */}
            <div
                className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200/80 "
                onClick={(e) => e.stopPropagation()} // stop click from bubbling to backdrop
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XIcon />
                    </button>
                </div>

                <div className="text-gray-600">
                    {children}
                </div>
            </div>
        </div>
    );
}