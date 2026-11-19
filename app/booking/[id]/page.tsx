
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Loader2,
  CalendarDays,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

interface Service {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  description: string;
  technicianEmail: string;
  technicianName?: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    bookingDate: "",
    instructions: "",
  });

  // Fetch service by ID
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services`);

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();

        const services = Array.isArray(data)
          ? data
          : data.services || data.data || [];

        const foundService = services.find(
          (item: Service) => item._id === id
        );

        if (!foundService) {
          toast.error("Service not found");
          setService(null);
          return;
        }

        setService(foundService);
      } catch (error) {
        console.error("Service fetching error:", error);
        toast.error("Failed to load service information");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Set customer name automatically
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customerName: session.user.name || "",
      }));
    }
  }, [session]);

  // Handle form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit booking
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!service) {
      toast.error("Service information not found");
      return;
    }

    setSubmitting(true);

    try {
      // Get authentication token
      const tokenRes = await fetch("/api/auth/token");
      const tokenData = await tokenRes.json();

      const token = tokenData.token;

      if (!token) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      // Send booking request
      const bookingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId: service._id,
            serviceTitle: service.title,
            technicianEmail: service.technicianEmail,
            customerName: formData.customerName,
            customerEmail: session.user.email,
            phone: formData.phone,
            address: formData.address,
            bookingDate: formData.bookingDate,
            instructions: formData.instructions,
            amount: service.basePrice,
          }),
        }
      );

      const result = await bookingRes.json();

      if (!bookingRes.ok) {
        toast.error(result.message || "Booking failed");
        return;
      }

      toast.success("Booking request submitted successfully!");

      // Correct My Bookings route
      router.push("/dashboard/customer/bookings");

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading screen
  if (isPending || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
      </div>
    );
  }

  // Service not found
  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Service Not Found
        </h1>

        <p className="text-gray-500 mt-2">
          The service you are trying to book could not be found.
        </p>

        <button
          onClick={() => router.back()}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Book a Service
        </h1>

        <p className="text-gray-500 mb-8">
          Fill in your details to book this service.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 md:p-8">

            <form onSubmit={handleBooking} className="space-y-6">

              <h2 className="text-xl font-semibold text-gray-800">
                Customer Information
              </h2>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />

                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Address
                </label>

                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Enter your full address"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preferred Date
                </label>

                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />

                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Instructions
                </label>

                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your problem or additional requirements..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>

            </form>
          </div>

          {/* Service Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">

              <h2 className="text-xl font-semibold text-gray-800 mb-5">
                Service Summary
              </h2>

              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Service
                </span>

                <h3 className="text-lg font-semibold text-gray-800 mt-1">
                  {service.title}
                </h3>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Category
                </span>

                <p className="text-gray-700 mt-1">
                  {service.category}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Technician
                </span>

                <p className="text-gray-700 mt-1">
                  {service.technicianName || service.technicianEmail}
                </p>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  Estimated Price
                </span>

                <span className="text-2xl font-bold text-orange-500">
                  ৳{service.basePrice}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Final price may change after the technician inspects
                your problem.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
