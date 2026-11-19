"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TechnicianRequestsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch technician requests
  const fetchRequests = useCallback(async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      const tokenRes = await fetch("/api/auth/token");
      const tokenData = await tokenRes.json();

      const token = tokenData.token;

      if (!token) {
        toast.error("Authentication failed. Please login again.");
        router.push("/sign-in");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/technician?email=${encodeURIComponent(
          session.user.email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Fetch requests error:", data);
        toast.error(data.message || "Failed to fetch requests");
        return;
      }

      setRequests(Array.isArray(data) ? data : data.requests || []);
    } catch (error) {
      console.error("Fetch requests error:", error);
      toast.error("Failed to load requests. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  }, [session, router]);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/sign-in");
      } else {
        fetchRequests();
      }
    }
  }, [isPending, session, fetchRequests, router]);

  // Update booking status
  const handleStatusChange = async (
    id: string,
    status: string,
    finalAmount?: number
  ) => {
    try {
      setUpdatingId(id);

      const tokenRes = await fetch("/api/auth/token");
      const tokenData = await tokenRes.json();

      const token = tokenData.token;

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            ...(finalAmount !== undefined && { finalAmount }),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update status");
        return;
      }

      toast.success(`Booking ${status} successfully!`);

      await fetchRequests();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Complete booking
  const handleCompleteClick = (req: any) => {
    const amountStr = prompt(
      "Enter final amount:",
      String(req.finalAmount || req.basePrice || req.amount || 0)
    );

    if (amountStr === null) return;

    const amount = Number(amountStr);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    handleStatusChange(req._id, "completed", amount);
  };

  // Loading screen
  if (isPending || isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Requests
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your customer service bookings.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-gray-500">
            No repair requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm"
            >

              {/* Booking Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">

                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    {req.serviceTitle || "Service Request"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Customer: {req.customerName || "Unknown"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase h-fit ${
                    req.status === "requested" || req.status === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : req.status === "accepted" || req.status === "confirmed"
                      ? "bg-indigo-100 text-indigo-700"
                      : req.status === "in-progress"
                      ? "bg-amber-100 text-amber-700"
                      : req.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status || "pending"}
                </span>

              </div>

              {/* Customer Details */}
              <div className="space-y-3 mb-5">

                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  {req.customerPhone || req.phone || "Phone not provided"}
                </p>

                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  {req.address || "Address not provided"}
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  {req.preferredDate
                    ? new Date(req.preferredDate).toLocaleDateString()
                    : req.bookingDate
                    ? new Date(req.bookingDate).toLocaleDateString()
                    : "Date not specified"}
                </p>

              </div>

              {/* Problem Description */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-5">
                <strong>Problem:</strong>{" "}
                {req.problemDescription ||
                  req.instructions ||
                  "No additional information provided."}
              </div>

              {/* Price */}
              <p className="text-sm text-gray-600 mb-5">
                <strong>Base Price:</strong>{" "}
                ৳{req.basePrice ?? req.amount ?? 0}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">

                {(req.status === "requested" || req.status === "pending") && (
                  <>
                    <button
                      disabled={updatingId === req._id}
                      onClick={() =>
                        handleStatusChange(req._id, "accepted")
                      }
                      className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updatingId === req._id
                        ? "Updating..."
                        : "Accept Request"}
                    </button>

                    <button
                      disabled={updatingId === req._id}
                      onClick={() =>
                        handleStatusChange(req._id, "rejected")
                      }
                      className="bg-red-100 text-red-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {req.status === "accepted" && (
                  <button
                    disabled={updatingId === req._id}
                    onClick={() =>
                      handleStatusChange(req._id, "in-progress")
                    }
                    className="bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
                  >
                    Start Work
                  </button>
                )}

                {req.status === "in-progress" && (
                  <button
                    disabled={updatingId === req._id}
                    onClick={() => handleCompleteClick(req)}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                )}

                {req.status === "completed" && (
                  <span className="text-green-600 font-semibold text-sm">
                    ✓ Job Completed
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
