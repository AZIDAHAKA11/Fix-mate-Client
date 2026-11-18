"use client";

import { useSession } from "@/lib/auth-client";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function CustomerOverviewPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Welcome, {session?.user?.name || "Customer"}!
      </h1>
      <p className="text-gray-500 mb-8">Track your device repairs and manage your bookings.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <ClipboardList className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-gray-500 text-sm font-medium">Total Requests</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">View All</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Clock className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-gray-500 text-sm font-medium">Active Jobs</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="text-gray-500 text-sm font-medium">Completed Jobs</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/customer/bookings" className="block bg-white border border-gray-200 p-8 rounded-2xl hover:border-indigo-400 transition shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">My Bookings</h2>
          <p className="text-gray-500">View status, pay for completed jobs, and manage requests.</p>
        </Link>
        <Link href="/services" className="block bg-indigo-600 text-white p-8 rounded-2xl hover:bg-indigo-700 transition shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Book New Service</h2>
          <p className="text-indigo-100">Browse and request new repair services.</p>
        </Link>
      </div>
    </div>
  );
}