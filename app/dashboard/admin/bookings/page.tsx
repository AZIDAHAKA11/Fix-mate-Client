"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // FETCH BOOKINGS
  // ============================================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get JWT token
        const tokenRes = await fetch("/api/auth/token");

        if (!tokenRes.ok) {
          throw new Error("Failed to get authentication token");
        }

        const tokenData = await tokenRes.json();
        const token = tokenData.token;

        // Fetch bookings with JWT
        const res = await fetch(
          "http://localhost:5000/api/admin/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();

        setBookings(data);

      } catch (error) {
        console.error("Fetch bookings error:", error);
        toast.error("Failed to fetch bookings");

      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        All Bookings
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">

        <table className="w-full text-left min-w-[800px]">

          {/* TABLE HEADER */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-sm">
                Service
              </th>

              <th className="p-4 font-semibold text-sm">
                Customer
              </th>

              <th className="p-4 font-semibold text-sm">
                Technician
              </th>

              <th className="p-4 font-semibold text-sm">
                Amount
              </th>

              <th className="p-4 font-semibold text-sm">
                Status
              </th>

              <th className="p-4 font-semibold text-sm">
                Payment
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>

            {bookings.map((b) => (
              <tr
                key={b._id}
                className="border-b border-gray-100 text-sm"
              >

                {/* SERVICE */}
                <td className="p-4 font-medium">
                  {b.serviceTitle || "N/A"}
                </td>

                {/* CUSTOMER */}
                <td className="p-4 text-gray-600">
                  {b.customerName || "N/A"}
                </td>

                {/* TECHNICIAN */}
                <td className="p-4 text-gray-600">
                  {b.technicianName || "Not assigned"}
                </td>

                {/* AMOUNT */}
                <td className="p-4 font-bold">
                  ${b.finalAmount ?? 0}
                </td>

                {/* BOOKING STATUS */}
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {b.status || "N/A"}
                  </span>
                </td>

                {/* PAYMENT STATUS */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      b.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.paymentStatus || "unpaid"}
                  </span>
                </td>

              </tr>
            ))}

            {/* EMPTY STATE */}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}