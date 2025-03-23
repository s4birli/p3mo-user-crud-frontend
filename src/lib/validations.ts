import { z } from 'zod';

export const userSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    firstName: z.string()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters"),
    middleName: z.string()
        .max(50, "Middle name must not exceed 50 characters")
        .optional(),
    lastName: z.string()
        .min(1, "Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters"),
    dateOfBirth: z.string()
        .min(1, "Date of birth is required")
        .refine((value) => {
            // First check if format matches YYYY-MM-DD pattern
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(value)) {
                return false;
            }
            
            // Then check if the date is valid
            try {
                const [year, month, day] = value.split('-').map(Number);
                
                // JavaScript months are 0-indexed, so we subtract 1 from the month
                const date = new Date(year, month - 1, day);
                
                // Check if the date is valid by comparing the components
                return (
                    date.getFullYear() === year &&
                    date.getMonth() === month - 1 &&
                    date.getDate() === day &&
                    !isNaN(date.getTime())
                );
            } catch {
                return false;
            }
        }, "Invalid date format. Must be in YYYY-MM-DD format")
        .refine((value) => {
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            
            // Check if the birthday has occurred this year
            const hasBirthdayOccurred = 
                today.getMonth() > birthDate.getMonth() || 
                (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
            
            // Calculate actual age
            const actualAge = hasBirthdayOccurred ? age : age - 1;
            
            return actualAge >= 18 && actualAge <= 100;
        }, "User must be between 18 and 100 years old"),
    roleId: z.number()
        .int("Role ID must be an integer")
        .positive("Role ID must be a positive number"),
    isActive: z.boolean()
        .default(true),
    country: z.string()
        .min(1, "Country is required")
        .min(2, "Country must be at least 2 characters")
        .max(50, "Country must not exceed 50 characters"),
});

// Form doğrulama için daha basit bir şema
export const createUserSchema = userSchema.omit({});

// Güncellemeler için kısmi şema
export const updateUserSchema = userSchema.partial();

// API Endpoint validasyonu için şema
export const userApiSchema = z.object({
    email: userSchema.shape.email,
    firstName: userSchema.shape.firstName,
    lastName: userSchema.shape.lastName,
    middleName: userSchema.shape.middleName.optional(),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    roleId: z.number().int().positive(),
    isActive: z.boolean(),
    country: z.string().min(1, "Country is required"),
}); 

export const pdfApiSchema = z.object({
    url: z.string().min(1, "URL is required"),
});