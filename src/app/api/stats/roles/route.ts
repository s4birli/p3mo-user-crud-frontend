import { NextResponse } from "next/server";
import { createApiClient } from "@/services/api";

// Create an API client to forward requests to the real database
const apiClient = createApiClient(undefined, {
  'Content-Type': 'application/json',
  'accept': '*/*'
});

/**
 * GET /api/stats/roles
 * Gets the distribution statistics by user roles
 */
export async function GET() {
  try {
    // Backend API call - redirecting to the correct endpoint
    const response = await apiClient.get('/Stats/roles');
    
    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching role distribution stats:', error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
} 