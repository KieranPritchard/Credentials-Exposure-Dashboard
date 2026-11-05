import { useForm } from "../../context/FormContext";
import React from "react";

// Interface to store the types for the props
interface FormFieldProps {
    name: string;
    label: string;
    type: string;
}

export default function FormField({ name, label, type = 'text' }: FormFieldProps):React.JSX.Element {
    // Stores the functions
    const { values, errors, handleChange, handleBlur } = useForm();
    const hasError:boolean = Boolean(errors[name]);

    // Stores the field value
    const fieldValue = (typeof values[name] === 'string' || typeof values[name] === 'number')
        ? values[name]
        : '';

    // Returns the field component
    return (
        <div className="flex flex-col space-y-1.5 mb-4">
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={name}
                type={type}
                value={fieldValue}
                onChange={(e):void => {
                    const val = type === 'number' ? (e.target.value === '' ? undefined : Number(e.target.value)) : e.target.value;
                    handleChange(name, val);
                }}
                onBlur={():void => handleBlur(name)}
                className={`w-full px-3 py-2 text-sm text-slate-900 bg-white border rounded-lg outline-none transition-all duration-150 ${
                    hasError 
                        ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-emerald-500/20'
                }`}
            />
            {hasError && (
                <span className="text-xs font-medium text-red-500 mt-1">
                    {errors[name]}
                </span>
            )}
        </div>
    );
}