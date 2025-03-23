import { NextRequest, NextResponse } from "next/server";
import { userApiSchema } from '@/lib/validations';
import { createApiClient } from "@/services/api";

// Create an API client to forward requests to the real database
const apiClient = createApiClient(undefined, {
  'Content-Type': 'application/json',
  'accept': '*/*'
});

/**
 * GET /api/users
 * Gets the list of users
 */
export async function GET() {
  try {
    // Backend API call
    const response = await apiClient.get('/users');
    
    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Creates a new user
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    
    // Zod validation
    const validationResult = userApiSchema.safeParse(body);
    
    // If validation error
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
    
    // If validation is successful, forward data to backend
    const validatedData = validationResult.data;
    
    // Backend API call
    const response = await apiClient.post('/users', validatedData);
    
    // Successful response
    return NextResponse.json(response.data, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Error handling
    console.error('Error creating user:', error);
    
    // Forward error response from backend
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Error creating user' },
        { status: error.response.status || 500 }
      );
    }
    
    // General error response
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
} 