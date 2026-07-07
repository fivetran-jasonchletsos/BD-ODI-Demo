import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="card p-8 text-center">
      <p className="text-lg font-semibold text-slate-800">Page not found</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-navy-500 hover:underline">
        Back to Overview
      </Link>
    </div>
  );
}
