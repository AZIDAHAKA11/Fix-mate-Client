"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TechnicianUpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    bio: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        area: (session.user as any).area || "",
        bio: (session.user as any).bio || "",
      });
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && session && (session.user as any).role !== "technician") {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;

  if (!session || (session.user as any).role !== "technician") {
    return <div>Redirecting...</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/update-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Read Only)
          </label>
          <input
            type="email"
            value={session.user.email || ""}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role (Read Only)
          </label>
          <input
            type="text"
            value="Technician"
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
);
}