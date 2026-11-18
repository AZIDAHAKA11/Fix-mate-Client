"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    
    if (!isPending && (!session || (session.user as any).role !== "technician")) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">Technician Panel</h2>
        <Link href="/dashboard/technician/add-service" className="p-3 hover:bg-indigo-50 rounded-lg text-gray-700 font-medium">Add Service</Link>
        <Link href="/dashboard/technician/requests" className="p-3 hover:bg-indigo-50 rounded-lg text-gray-700 font-medium">Manage Requests</Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}