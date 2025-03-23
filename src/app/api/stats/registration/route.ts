import { NextResponse } from "next/server";
import { apiClient } from "@/services/api";

/**
 * GET /api/stats/registration
 * Gets monthly user registration statistics
 */
export async function GET() {
  try {
    // Backend API call - redirecting to the correct endpoint
    const response = await apiClient.get('/Stats/registration');
    
    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
} 