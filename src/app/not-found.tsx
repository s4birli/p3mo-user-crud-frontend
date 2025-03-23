import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        Sorry, the page you are looking for does not exist or may have been moved.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-primary rounded-md text-white font-medium hover:bg-primary/90 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
} 