'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { cn, generateFileNameFromUrl } from '@/lib/utils';
import axios from 'axios';
import { toast } from 'sonner';

interface PrintButtonProps {
  onPrint?: () => void;
  className?: string;
}

/**
 * A reusable print button component that generates a PDF of the current page
 * 
 * @param onPrint - Optional callback to run after printing
 * @param className - Optional additional CSS classes
 */
export function PrintButton({
  onPrint,
  className
}: PrintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = async () => {
    try {
      setIsLoading(true);
      
      // The API endpoint to call depends on whether we have an entityId
      const endpoint = '/api/pdf/current';
      
      const response = await axios.post(endpoint, {}, {
        responseType: 'blob'
      });
      
      // Create a blob from the PDF Stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create an object URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and click it to start the download
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = generateFileNameFromUrl();
        
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Call the onPrint callback if provided
      if (onPrint) {
        onPrint();
      }
      
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      disabled={isLoading}
      className={cn("flex items-center gap-2", className)}
    >
      <Printer className="h-4 w-4" />
      {isLoading ? 'Generating...' : 'Print'}
    </Button>
  );
} 