"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BookingModal({ service, onClose }: { service: any, onClose: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerPhone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.problemDescription.length < 20) {
      return toast.error("Description must be at least 20 characters");
    }

    if (!session?.user) {
      toast.error("Please login to request a repair.");
      return;
    }

    setIsLoading(true);

    try {
      // TypeScript error bypassed using 'as any'
      const token = (session as any)?.session?.token || (session as any)?.token; 

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: service._id,
          serviceTitle: service.title,
          serviceImage: service.image,
          category: service.category,
          basePrice: service.basePrice,
          technicianName: service.technicianName,
          technicianEmail: service.technicianEmail,
          customerName: session.user.name,
          customerEmail: session.user.email,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit request");

      toast.success("Booking requested successfully!");
      onClose();
      
      router.push("/dashboard/customer/bookings");
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Request Repair</h2>
        <p className="text-sm text-gray-500 mb-6">{service.title}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" name="customerPhone" required onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="017XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address" required onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="House, Road, Area" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input type="date" name="preferredDate" required min={new Date().toISOString().split('T')[0]} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description (Min 20 chars)</label>
            <textarea name="problemDescription" required rows={3} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="What is wrong with your device?"></textarea>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}