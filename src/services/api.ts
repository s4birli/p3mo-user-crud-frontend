import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { User, UserFormData, UserStats, Role } from '../types';

/**********************
 * SHARED UTILITIES
 **********************/

// Helper function to prepare UserFormData for backend
const prepareUserForSubmission = (userData: UserFormData): Record<string, unknown> => {
  return {
    email: userData.email,
    isActive: userData.isActive,
    firstName: userData.firstName,
    middleName: userData.middleName || '',
    lastName: userData.lastName,
    dateOfBirth: userData.dateOfBirth,
    roleId: userData.roleId,
    country: userData.country
  };
};

// Helper function to handle API errors
function handleApiError(error: unknown): Error {
  const axiosError = error as AxiosError<ErrorResponse>;
  const errorMessage = 
    axiosError.response?.data?.message || 
    axiosError.message || 
    'An error occurred';
  
  return new Error(errorMessage);
}

// API types
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, unknown>;
}

/**********************
 * CLIENT-SIDE API
 **********************/

// Frontend için Next.js API routes (BFF)
const BFF_API_URL = '/api';

// Frontend için axios instance - BFF üzerinden çağrı yapacak
const bffApi = axios.create({
  baseURL: BFF_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client-side user service (browser'da çalışır)
export const clientUserService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await bffApi.get<User[]>('/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await bffApi.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: UserFormData): Promise<User> => {
    const transformedData = prepareUserForSubmission(userData);
    const response = await bffApi.post<User>('/users', transformedData);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: Partial<UserFormData>): Promise<User> => {
    // Create partial update data
    const updateData: Record<string, unknown> = {};
    
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.isActive !== undefined) updateData.isActive = userData.isActive;
    if (userData.firstName !== undefined) updateData.firstName = userData.firstName;
    if (userData.middleName !== undefined) updateData.middleName = userData.middleName;
    if (userData.lastName !== undefined) updateData.lastName = userData.lastName;
    if (userData.dateOfBirth !== undefined) updateData.dateOfBirth = userData.dateOfBirth;
    if (userData.roleId !== undefined) updateData.roleId = userData.roleId;
    if (userData.country !== undefined) updateData.country = userData.country;
    
    const response = await bffApi.put<User>(`/users/${id}`, updateData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await bffApi.delete(`/users/${id}`);
  },
};

// Client-side role service
export const clientRoleService = {
  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await bffApi.get<Role[]>('/roles');
    return response.data;
  },

  // Get role by ID
  getRoleById: async (id: number): Promise<Role> => {
    const response = await bffApi.get<Role>(`/roles/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    const response = await bffApi.post<Role>('/roles', roleData);
    return response.data;
  },

  // Update role
  updateRole: async (id: number, roleData: Partial<Omit<Role, 'id'>>): Promise<Role> => {
    const response = await bffApi.put<Role>(`/roles/${id}`, roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await bffApi.delete(`/roles/${id}`);
  },
};

// Client-side PDF service
export const clientPdfService = {
  // Generate user PDF
  generateUserPdf: async (id: number): Promise<Blob> => {
    const response = await bffApi.get(`/pdf/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  generatePdf: async (url: string): Promise<Blob> => {
    const response = await bffApi.post(`/pdf`, {
      url,
      responseType: 'blob'
    });
    return response.data;
  },
};

// Client-side statistics service
export const clientStatsService = {
  // Fetch statistics required for dashboard
  getUserStats: async (): Promise<UserStats> => {
    try {
      // Active/inactive statistics
      const activeStatsResponse = await bffApi.get('/stats/active');
      const activeStats = activeStatsResponse.data;

      // Role distribution statistics
      const roleDistResponse = await bffApi.get('/stats/roles');
      const roleDistribution = roleDistResponse.data;

      // Monthly registration statistics
      const regStatsResponse = await bffApi.get('/stats/registration');
      const registrationStats = regStatsResponse.data;

      // Transform role distribution
      const roleCounts = {
        Admin: 0,
        User: 0,
        Guest: 0
      };

      // Process role distribution
      roleDistribution.forEach((item: { role: string; count: number }) => {
        if (item.role in roleCounts) {
          roleCounts[item.role as keyof typeof roleCounts] = item.count;
        }
      });

      // Transform registration statistics
      const monthlyRegs = registrationStats.map((item: { month: number; year: number; count: number }) => ({
        month: `${item.year}-${item.month.toString().padStart(2, '0')}`,
        count: item.count
      }));

      // Return combined stats
      return {
        active: activeStats.active || 0,
        inactive: activeStats.inactive || 0,
        roleDistribution: roleCounts,
        monthlyRegistrations: monthlyRegs
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Return default empty stats on error
      return {
        active: 0,
        inactive: 0,
        roleDistribution: {
          Admin: 0,
          User: 0,
          Guest: 0
        },
        monthlyRegistrations: []
      };
    }
  }
};

// Client-side API services (Component içinde import edilecek)
export const apiServices = {
  user: clientUserService,
  role: clientRoleService,
  pdf: clientPdfService,
  stats: clientStatsService,
};

// Geriye dönük uyumluluk için
export const userService = clientUserService;
export const roleService = clientRoleService;
export const pdfService = clientPdfService;
export const statsService = clientStatsService;

/**********************
 * SERVER-SIDE API 
 **********************/

// Create base API client for common configurations
export const createApiClient = (baseURL?: string, headers?: Record<string, string>) => {
  return axios.create({
    baseURL: baseURL || process.env.BACKEND_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  });
};

// Default API client instance
export const apiClient = createApiClient();

// Server-side API methods
export const serverApi = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Server-side service implementations for Route Handlers
export const serverUserService = {
  getAllUsers: () => serverApi.get<User[]>('/users'),
  getUserById: (id: number) => serverApi.get<User>(`/users/${id}`),
  createUser: (data: unknown) => serverApi.post<User>('/users', data),
  updateUser: (id: number, data: unknown) => serverApi.put<User>(`/users/${id}`, data),
  deleteUser: (id: number) => serverApi.delete<void>(`/users/${id}`),
};

export const serverStatsService = {
  getUserStats: async () => {
    const [activeStats, roleDistribution, registrationStats] = await Promise.all([
      serverApi.get<{active: number, inactive: number}>('/stats/active'),
      serverApi.get<unknown[]>('/stats/roles'),
      serverApi.get<unknown[]>('/stats/registration'),
    ]);
    
    return {
      active: activeStats.active || 0,
      inactive: activeStats.inactive || 0,
      roleDistribution: roleDistribution || { Admin: 0, User: 0, Guest: 0 },
      monthlyRegistrations: registrationStats || [],
    };
  },
};

export const serverPdfService = {
  generatePdf: (url: string) => 
    apiClient.post(`/Pdf?url=${encodeURIComponent(url)}`, '', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }),
};

export const serverRoleService = {
  getAllRoles: () => serverApi.get<Role[]>('/Roles'),
};