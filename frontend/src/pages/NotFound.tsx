import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-7xl font-black text-indigo-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Page not found</h1>
        <p className="text-zinc-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
