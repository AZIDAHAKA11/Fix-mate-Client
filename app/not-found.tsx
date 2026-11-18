import Link from "next/link";
import { Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Wrench className="w-24 h-24 text-indigo-600 mb-6 animate-pulse" />
      <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-xl text-gray-500 mb-8">Oops! This page could not be found.</p>
      <Link href="/" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 transition">
        Back to Home
      </Link>
    </div>
  );
}// 404 page
