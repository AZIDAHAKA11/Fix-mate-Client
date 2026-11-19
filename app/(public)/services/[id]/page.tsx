"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  User,
  Star,
  Wrench,
} from "lucide-react";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services?search=`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const services = await response.json();

        const foundService = services.find(
          (item: any) => item._id === id
        );

        if (!foundService) {
          setError("Service not found.");
          return;
        }

        setService(foundService);
      } catch (error) {
        console.error("Service fetch error:", error);
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Error / Not found
  if (error || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-6 text-center">
        <Wrench className="w-16 h-16 text-gray-300 mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Service Not Found
        </h1>

        <p className="text-gray-500 mb-6">
          {error || "This service may have been removed or is unavailable."}
        </p>

        <Link
          href="/services"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">

      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2">

          {/* Service Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

            {/* Service Header */}
            <div className="p-6 md:p-8">

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {service.category}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {service.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
                {service.title}
              </h1>

              <div className="text-3xl font-bold text-indigo-600 mb-6">
                ৳{service.basePrice}
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  About This Service
                </h2>

                <p className="text-gray-600 leading-7 whitespace-pre-line">
                  {service.description || "No description provided."}
                </p>
              </div>

              {/* Service Mode */}
              <div className="mt-6 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />

                <div>
                  <p className="text-sm text-gray-500">
                    Service Mode
                  </p>

                  <p className="font-medium text-gray-800 capitalize">
                    {service.serviceMode || "On-site"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Service Provider
            </h2>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-7 h-7 text-indigo-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {service.technicianName || "Technician"}
                </h3>

                <p className="text-sm text-gray-500">
                  {service.technicianEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Book This Service
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Get professional service from an experienced technician.
            </p>

            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Service Price
                </span>

                <span className="text-xl font-bold text-indigo-600">
                  ৳{service.basePrice}
                </span>
              </div>
            </div>

            {service.isAvailable ? (
              <button
                onClick={() =>
                  router.push(`/booking/${service._id}`)
                }
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Book Now
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                Currently Unavailable
              </button>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              You can review the booking details before confirming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
