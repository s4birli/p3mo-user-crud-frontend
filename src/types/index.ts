export type UserRole = 'Admin' | 'User' | 'Guest';

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    role: UserRole;
    roleId: number;
    isActive: boolean;
    country: string;
    createdAt: string;
}

export interface UserFormData {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    roleId: number;
    isActive: boolean;
    country: string;
}

export interface UserStats {
    active: number;
    inactive: number;
    roleDistribution: {
        Admin: number;
        User: number;
        Guest: number;
    };
    monthlyRegistrations: {
        month: string;
        count: number;
    }[];
} 