
"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";

export default function AddServicePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Smartphone",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "Home Visit",
    serviceArea: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageUploading(true);

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.data.url,
        }));

        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a service image");
      return;
    }

    setLoading(true);

    try {
      // Get JWT token from Better Auth
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        console.error("Token error:", tokenError);
        toast.error("Failed to get authentication token");
        return;
      }

      const serviceData = {
        ...formData,
        basePrice: Number(formData.basePrice),
        technicianName: session.user.name,
        technicianEmail: session.user.email,
        approvalStatus: "pending",
        isAvailable: true,
        createdAt: new Date(),
      };

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (res.ok) {
        toast.success(
          "Service added successfully! Waiting for admin approval."
        );

        router.push("/dashboard/technician/my-services");
      } else {
        const error = await res.json();

        console.error("Add service error:", error);

        toast.error(error.message || "Failed to add service");
      }
    } catch (error) {
      console.error("Add service error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Add New Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title
            </label>

            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="e.g. iPhone Screen Replacement"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop & PC">Laptop & PC</option>
              <option value="AC">AC</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="TV">TV</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (USD)
            </label>

            <input
              required
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              type="number"
              min="1"
              placeholder="50"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration
            </label>

            <input
              required
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              type="text"
              placeholder="e.g. 2-3 hours"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Mode
            </label>

            <select
              name="serviceMode"
              value={formData.serviceMode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Area
            </label>

            <input
              required
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Mirpur, Dhaka"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe what the service includes..."
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Image
          </label>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition flex items-center gap-2">
              {imageUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}

              {imageUploading ? "Uploading..." : "Upload Image"}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {formData.image && (
              <img
                src={formData.image}
                alt="Service"
                className="w-16 h-16 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || imageUploading}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Add Service"
          )}
        </button>
      </form>
    </div>
  );
}
