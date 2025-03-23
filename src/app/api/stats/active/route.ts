import { NextResponse } from "next/server";
import { apiClient } from '@/services/api';

/**
 * GET /api/stats/active
 * Gets the number of active and inactive users
 */
export async function GET() {
  try {
    // Backend API call - redirecting to the correct endpoint
    const response = await apiClient.get('/Stats/active');
    
    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching active/inactive stats:', error);
    return NextResponse.json(
      { 
        message: "Error fetching active/inactive stats",
        active: 0,
        inactive: 0,
        total: 0
      },
      { status: 500 }
    );
  }
} 