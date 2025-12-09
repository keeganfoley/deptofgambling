import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
