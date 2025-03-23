import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFileNameFromUrl() {
  try {
    const url = new URL(window.location.href);
    const path = url.pathname.replace(/\/$/, ''); 

    // Handle root path
    if (!path || path === '/') {
      return 'home.pdf';
    }

    // Split the path into segments
    const segments = path.split('/').filter(Boolean); // remove empty strings

    if (segments.length === 0) {
      return 'home.pdf';
    } else if (segments.length === 1) {
      if (segments[0].toLowerCase() === 'users') {
        return 'user-list.pdf';
      } else {
        return `${segments[0]}.pdf`;
      }
    } else if (segments.length === 2) {
      const id = parseInt(segments[1], 10);
      if (segments[0].toLowerCase() === 'user' && !isNaN(id)) {
        return `user-${id}.pdf`;
      } else {
        return `${segments[0]}-${segments[1]}.pdf`;
      }
    } else {
      // For more complex paths, use the last two segments
      const last = segments[segments.length - 1];
      const secondLast = segments[segments.length - 2];
      return `${secondLast}-${last}.pdf`;
    }
  } catch {
    return 'document.pdf';
  }
}
