"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Loader2,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  ClipboardList,
} from "lucide-react";

export default function CustomerBookingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  // Fetch customer bookings
  useEffect(() => {
    const fetchBookings = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load bookings");
          return;
        }

        setBookings(Array.isArray(data) ? data : data.bookings || []);
      } catch (error) {
        console.error("Bookings fetch error:", error);
        toast.error("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      if (!session?.user) {
        router.push("/sign-in");
      } else {
        fetchBookings();
      }
    }
  }, [session, isPending, router]);

  // Stripe payment
  const handlePayment = async (bookingId: string) => {
    try {
      setPayingId(bookingId);

      toast.loading("Connecting to Stripe...", {
        id: "payment",
      });

      const tokenRes = await fetch("/api/auth/token");
      const tokenData = await tokenRes.json();

      const token = tokenData.token;

      if (!token) {
        toast.error("Authentication failed", {
          id: "payment",
        });
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Payment session creation failed", {
          id: "payment",
        });
        return;
      }

      if (data.url) {
        toast.success("Redirecting to payment...", {
          id: "payment",
        });

        window.location.href = data.url;
      } else {
        toast.error("Payment URL not found", {
          id: "payment",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);

      toast.error("Something went wrong with payment", {
        id: "payment",
      });
    } finally {
      setPayingId(null);
    }
  };

  // Loading screen
  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Bookings
          </h1>

          <p className="text-gray-500 mt-2">
            Track your service requests and payments.
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />

            <h2 className="text-xl font-semibold text-gray-800">
              No Bookings Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't booked any services yet.
            </p>

            <button
              onClick={() => router.push("/services")}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Booking Cards */}
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-7"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  {/* Booking Details */}
                  <div className="flex-1 space-y-4">

                    {/* Title & Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {booking.serviceTitle || "Service Booking"}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status?.toUpperCase() || "PENDING"}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.paymentStatus?.toUpperCase() || "UNPAID"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-orange-500" />

                      <span>
                        {booking.preferredDate
                          ? new Date(booking.preferredDate).toLocaleDateString()
                          : booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString()
                          : "Date not specified"}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />

                      <span>
                        {booking.address || "Address not provided"}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-orange-500" />

                      <span>
                        {booking.customerPhone || booking.phone || "Phone not provided"}
                      </span>
                    </div>

                    {/* Technician */}
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">
                        Technician:
                      </strong>{" "}
                      {booking.technicianName ||
                        booking.technicianEmail ||
                        "Not assigned yet"}
                    </p>

                    {/* Problem */}
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-800">
                        Problem:
                      </strong>{" "}
                      {booking.problemDescription ||
                        booking.instructions ||
                        "No additional information"}
                    </p>

                  </div>

                  {/* Price & Payment */}
                  <div className="lg:w-56 flex flex-col justify-between items-start lg:items-end gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        ৳
                        {booking.paymentStatus === "paid"
                          ? booking.finalAmount ?? booking.basePrice
                          : booking.finalAmount ?? booking.basePrice ?? booking.amount}
                      </p>
                    </div>

                    {/* Pay Button */}
                    {booking.status === "completed" &&
                      booking.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handlePayment(booking._id)}
                          disabled={payingId === booking._id}
                          className="w-full lg:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          {payingId === booking._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              Pay Now
                            </>
                          )}
                        </button>
                      )}

                    {/* Payment Complete */}
                    {booking.paymentStatus === "paid" && (
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <span>✓</span>
                        Payment Completed
                      </div>
                    )}

                  </div>
                </div>

                {/* Booking ID */}
                <div className="border-t border-gray-100 mt-6 pt-4">
                  <p className="text-xs text-gray-400">
                    Booking ID: {booking._id}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
