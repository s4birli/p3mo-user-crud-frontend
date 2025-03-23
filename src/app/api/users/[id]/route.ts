import { NextRequest, NextResponse } from "next/server";
import { apiClient } from '@/services/api';
import { updateUserSchema } from '@/lib/validations';

/**
 * GET /api/users/[id]
 * Gets a specific user by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Access the id directly from params
        const id = (await params).id;
        
        const response = await apiClient.get(`/users/${id}`);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        // Check if it's a 404 error
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 404) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.error('Error fetching user:', error);
        return NextResponse.json(
            { message: "Error fetching user" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/users/[id]
 * Updates a specific user
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Access the id directly from params
        const id = (await params).id;
        
        const userData = await request.json();
        
        // Validation with Zod
        const validationResult = updateUserSchema.safeParse(userData);
        
        // If validation fails
        if (!validationResult.success) {
            const formattedErrors = validationResult.error.format();
            return NextResponse.json(
                { 
                    message: "Validation failed", 
                    errors: formattedErrors 
                },
                { status: 400 }
            );
        }
        
        // Use validated data
        const validatedData = validationResult.data;
        
        // Backend API call
        const response = await apiClient.put(`/users/${id}`, validatedData);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        // Check if it's a 404 error
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 404) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.error('Error updating user:', error);
        return NextResponse.json(
            { message: "Error updating user" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/users/[id]
 * Deletes a specific user
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Access the id directly from params
        const id = (await params).id;
        
        await apiClient.delete(`/users/${id}`);
        return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
        // Check if it's a 404 error
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response && error.response.status === 404) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.error('Error deleting user:', error);
        return NextResponse.json(
            { message: "Error deleting user" },
            { status: 500 }
        );
    }
} 