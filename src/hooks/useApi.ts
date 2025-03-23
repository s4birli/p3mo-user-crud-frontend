import { useState, useCallback } from 'react';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { createApiClient } from '@/services/api';

// Create an Axios instance with defaults
const apiClient = createApiClient(undefined, {
    'Content-Type': 'application/json',
    'accept': '*/*'
  });

interface ApiResponse<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

interface ApiMethods {
    get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
    delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
    upload: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) => Promise<T>;
}

interface ErrorResponse {
    message?: string;
}

export function useApi<T>(): [ApiResponse<T>, ApiMethods] {
    const [state, setState] = useState<ApiResponse<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const handleRequest = useCallback(async <R>(
        request: () => Promise<AxiosResponse<R>>
    ): Promise<R> => {
        setState((prevState) => ({ ...prevState, isLoading: true, error: null }));

        try {
            const response = await request();
            setState({ data: response.data as unknown as T, isLoading: false, error: null });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            const errorMessage = axiosError.response?.data?.message || axiosError.message || 'An error occurred';
            const customError = new Error(errorMessage);
            setState({ data: null, isLoading: false, error: customError });
            throw customError;
        }
    }, []);

    const methods: ApiMethods = {
        get: useCallback(<R>(url: string, config?: AxiosRequestConfig) =>
            handleRequest<R>(() => apiClient.get<R>(url, config)), [handleRequest]),

        post: useCallback(<R>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
            handleRequest<R>(() => apiClient.post<R>(url, data, config)), [handleRequest]),

        put: useCallback(<R>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
            handleRequest<R>(() => apiClient.put<R>(url, data, config)), [handleRequest]),

        delete: useCallback(<R>(url: string, config?: AxiosRequestConfig) =>
            handleRequest<R>(() => apiClient.delete<R>(url, config)), [handleRequest]),

        upload: useCallback(<R>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
            handleRequest<R>(() => apiClient.post<R>(url, formData, {
                ...config,
                headers: {
                    ...config?.headers,
                    'Content-Type': 'multipart/form-data',
                },
            })), [handleRequest]),
    };

    return [state, methods];
}

export default useApi; 