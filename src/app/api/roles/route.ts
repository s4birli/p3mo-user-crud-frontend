import { NextResponse } from "next/server";
import { apiClient } from '@/services/api';

/**
 * GET /api/roles
 * Gets all roles
 */
export async function GET() {
  try {
    // Backend API call
    const response = await apiClient.get('/Roles');
    
    // Return the response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      [],
      { status: 500 }
    );
  }
} 