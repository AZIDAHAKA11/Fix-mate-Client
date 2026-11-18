"use client";

import { useSession } from "@/lib/auth-client";
import { Wrench, ClipboardList, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TechnicianOverviewPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Welcome, {session?.user?.name || "Technician"}!
      </h1>
      <p className="text-gray-500 mb-8">Manage your services and repair requests from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Wrench className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-gray-500 text-sm font-medium">My Services</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">Manage</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <ClipboardList className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">Check Now</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="text-gray-500 text-sm font-medium">Completed Jobs</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">View</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/technician/add-service" className="block bg-indigo-600 text-white p-8 rounded-2xl hover:bg-indigo-700 transition shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Add New Service</h2>
          <p className="text-indigo-100">List a new repair service and start earning.</p>
        </Link>
        <Link href="/dashboard/technician/requests" className="block bg-white border border-gray-200 p-8 rounded-2xl hover:border-indigo-400 transition shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">View Requests</h2>
          <p className="text-gray-500">Accept or reject incoming repair jobs.</p>
        </Link>
      </div>
    </div>
  );
}