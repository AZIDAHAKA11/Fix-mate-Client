"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader2, Calendar, MapPin, Phone, CreditCard } from "lucide-react";

export default function CustomerBookingsPage() {
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.email) return;
      
      try {
        const token = (session as any)?.session?.token || (session as any)?.token;
        const res = await fetch(`http://localhost:5000/api/bookings/my`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          toast.error("Failed to load bookings");
        }
      } catch (error) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      if (!session) window.location.href = "/sign-in";
      else fetchBookings();
    }
  }, [session, isPending]);

  const handlePayment = async (bookingId: string) => {
    try {
      toast.loading("Connecting to Stripe...", { id: "payment" });

      const res = await fetch("http://localhost:5000/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();
      
      if (data.url) {
        toast.success("Redirecting to Stripe...", { id: "payment" });
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Payment failed", { id: "payment" });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: "payment" });
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-500">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">{booking.serviceTitle}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {booking.status.toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {booking.paymentStatus.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                  <p className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(booking.preferredDate).toLocaleDateString()}</p>
                  <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.address}</p>
                  <p className="flex items-center gap-1"><Phone className="w-4 h-4" /> {booking.customerPhone}</p>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Technician:</strong> {booking.technicianName}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Problem:</strong> {booking.problemDescription}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                <p className="text-xl font-bold text-gray-900">
                  ${booking.paymentStatus === 'paid' ? booking.finalAmount : booking.basePrice}
                </p>
                
                {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                  <button 
                    onClick={() => handlePayment(booking._id)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}// update
