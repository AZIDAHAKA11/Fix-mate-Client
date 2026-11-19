
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditServicePage() {
  const { data: session, isPending } = useSession();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    basePrice: "",
    description: "",
    serviceMode: "onsite",
  });

  // Load existing service
  useEffect(() => {
    const fetchService = async () => {
      if (isPending || !session?.user?.email) return;

      try {
        const tokenResponse = await fetch("/api/auth/token");

        if (!tokenResponse.ok) {
          throw new Error("Failed to get authentication token");
        }

        const tokenData = await tokenResponse.json();

        const response = await fetch(
          `http://localhost:5000/api/services?technicianEmail=${session.user.email}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const services = await response.json();

        const service = services.find(
          (item: any) => item._id === id
        );

        if (!service) {
          toast.error("Service not found");
          router.push("/dashboard/technician/my-services");
          return;
        }

        setFormData({
          title: service.title || "",
          category: service.category || "",
          basePrice: service.basePrice?.toString() || "",
          description: service.description || "",
          serviceMode: service.serviceMode || "onsite",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [session, isPending, id, router]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Failed to get authentication token");
      }

      const tokenData = await tokenResponse.json();

      const response = await fetch(
        `http://localhost:5000/api/services/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: Number(formData.basePrice),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service");
      }

      toast.success("Service updated successfully!");

      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/technician/my-services"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Service
          </h1>

          <p className="text-gray-500 text-sm">
            Update your service information
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5"
      >

        {/* Service Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter service title"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter category"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Price
          </label>

          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter price"
          />
        </div>

        {/* Service Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Mode
          </label>

          <select
            name="serviceMode"
            value={formData.serviceMode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Describe your service..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">

          <Link
            href="/dashboard/technician/my-services"
            className="flex-1 text-center border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Service
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  );
}