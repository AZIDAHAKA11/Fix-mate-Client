import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  );
}