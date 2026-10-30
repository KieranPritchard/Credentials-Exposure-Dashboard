import React, { useContext, useState, type ReactNode, type Context} from "react";
import * as z from "zod";

type FormErrors = Record<string, string | undefined>;

export interface FormContextType<T extends Record<string, unknown> = Record<string, unknown>> {
    values: T;
    errors: FormErrors;
    handleChange: (name: keyof T & string, value: unknown) => void;
    handleBlur: (name: keyof T & string) => void;
    validateAll: () => { valid: true; data: T } | { valid: false; data: null };
    setValues: React.Dispatch<React.SetStateAction<T>>;
}

// Creates the typing interface
interface FormProviderProps<TSchema extends z.ZodType> {
    children: ReactNode;
    schema: TSchema;
    initialValues?: Partial<z.infer<TSchema>>;
}

// Creates a form context
const FormContext:Context<FormContextType> = React.createContext<FormContextType>(
    {} as FormContextType
);

// Exports the form provider
export function FormProvider<
    TSchema extends z.ZodType<Record<string, unknown>>
>({ children, schema, initialValues }: FormProviderProps<TSchema>){
    type TData = z.infer<TSchema>;

    // Stores the values and the errors
    const [values, setValues] = useState<TData>(initialValues as TData);
    const [errors, setErrors] = useState<FormErrors>({});

    // Handler function to handle the changing inputs
    const handleChange = (name: keyof z.infer<TSchema> & string, value: unknown): void => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        } as z.infer<TSchema>));
    };

    // Helper function to extract shape from ZodObject or wrapped schemas (e.g. .refine())
    const getShape = (s: unknown): Record<string, z.ZodTypeAny> | null => {
        if (!s || typeof s !== 'object') return null;
        if (s instanceof z.ZodObject) return s.shape as Record<string, z.ZodTypeAny>;
        if ('shape' in s && typeof (s as { shape: unknown }).shape === 'object') {
            return (s as { shape: Record<string, z.ZodTypeAny> }).shape;
        }
        if ('innerType' in s && typeof (s as { innerType: () => unknown }).innerType === 'function') {
            return getShape((s as { innerType: () => unknown }).innerType());
        }
        if ('_def' in s && typeof (s as { _def: Record<string, unknown> })._def === 'object') {
            const def = (s as { _def: Record<string, unknown> })._def;
            if (def.schema) return getShape(def.schema);
            if (def.innerType) return getShape(def.innerType);
        }
        return null;
    };

    // Handler function to validate field
    const validateField = (name: keyof TData & string, value: unknown): string | null => {
        const shape = getShape(schema);
        if (!shape) return null;

        const fieldSchema = shape[name] as z.ZodTypeAny | undefined;
        if (!fieldSchema) return null;

        // Parses the result
        const result = fieldSchema.safeParse(value);

        // Returns the result
        return result.success ? null : result.error.issues[0]?.message ?? "Invalid field";
    };

    const handleBlur = (name: keyof TData & string) => {
        // Stores the result
        const error:string | null = validateField(name, values[name]);

        // Sets the errors
        setErrors(prev => ({ ...prev, [name]: error ?? undefined}));
    };

    const validateAll = () => {
        // Gets the result from the schema
        const result = schema.safeParse(values);

        // Checks if the result was successful
        if (result.success) {
            setErrors({});
            return { valid: true as const, data: result.data };
        }

        const fieldErrors: FormErrors = {};
        result.error.issues.forEach(issue => {
            const key = issue.path[0];
            if (key !== undefined) {
                fieldErrors[key.toString()] = issue.message;
            }
        });

        // Sets the errors
        setErrors(fieldErrors);

        // Returns the validity is false
        return { valid: false as const, data: null };
    };

    // Stores the context values
    const contextValue: FormContextType<TData> = {
        values,
        errors,
        handleChange,
        handleBlur,
        validateAll,
        setValues,
    };

    return (
        <FormContext.Provider value={contextValue as unknown as FormContextType}>
            {children}
        </FormContext.Provider>
    );
}

export function useForm<T extends Record<string, unknown>>() {
    const context = useContext(FormContext) as FormContextType<T> | null;
    if (!context) throw new Error('useForm must be used within FormProvider');
    return context;
}