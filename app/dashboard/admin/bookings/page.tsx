"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/bookings");
        if (res.ok) setBookings(await res.json());
      } catch (error) {
        toast.error("Failed to fetch bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">All Bookings</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-sm">Service</th>
              <th className="p-4 font-semibold text-sm">Customer</th>
              <th className="p-4 font-semibold text-sm">Technician</th>
              <th className="p-4 font-semibold text-sm">Amount</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-gray-100 text-sm">
                <td className="p-4 font-medium">{b.serviceTitle}</td>
                <td className="p-4 text-gray-600">{b.customerName}</td>
                <td className="p-4 text-gray-600">{b.technicianName}</td>
                <td className="p-4 font-bold">${b.finalAmount}</td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{b.status}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{b.paymentStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}