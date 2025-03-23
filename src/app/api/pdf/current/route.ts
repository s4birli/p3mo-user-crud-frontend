import { NextRequest, NextResponse } from "next/server";
import { createApiClient } from '@/services/api';
import { z } from 'zod';
import { generateFileNameFromUrl } from "@/lib/utils";

// Create a custom API client with specific headers for PDF service
const pdfApiClient = createApiClient(undefined, {
  'Content-Type': 'application/json',
  'accept': '*/*'
});

// Schema for URL validation
const urlSchema = z.object({
  url: z.string().url("Invalid URL format").optional(),
});

/**
 * POST /api/pdf/current
 * Generates a PDF from the current page
 */
export async function POST(request: NextRequest) {
    try {
        // Get URL from request body or use referer
        let url;
        
        // Try to read request body first
        const body = await request.json().catch(() => ({}));
        const validation = urlSchema.safeParse(body);
        
        if (validation.success && validation.data.url) {
            // Use URL from request body if available
            url = validation.data.url;
        } else {
            // Get URL from referer header
            const referer = request.headers.get('referer');
            url = referer || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`;
        }
        
        console.log(`Generating PDF for URL: ${url}`);
        
        // Forward to backend PDF API - using query parameter instead of request body
        const response = await pdfApiClient.post(`/Pdf?url=${encodeURIComponent(url)}`, '', {
            responseType: 'arraybuffer', // Required for binary files
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });
        
        // Set up response headers
        const headers = new Headers();
        
        // Add Content-Type header
        const contentType = response.headers['content-type'] || 'application/pdf';
        headers.append('Content-Type', contentType);
        
        // Generate a filename based on the URL
        const fileName = generateFileNameFromUrl();
        const contentDisposition = response.headers['content-disposition'] || `attachment; filename="${fileName}"`;
        headers.append('Content-Disposition', contentDisposition);
        
        // Return the PDF data
        return new NextResponse(response.data, {
            status: 200,
            headers: headers
        });
    } catch (error: unknown) {
        console.error('Error generating PDF:', error);
        
        // Handle error responses
        if (error && typeof error === 'object' && 'response' in error && 
            error.response && typeof error.response === 'object' && 
            'status' in error.response) {
            
            const status = error.response.status;
            
            if (status === 404) {
                return NextResponse.json(
                    { message: "Page not found" },
                    { status: 404 }
                );
            }
        }
        
        return NextResponse.json(
            { message: "Error generating PDF" },
            { status: 500 }
        );
    }
} 