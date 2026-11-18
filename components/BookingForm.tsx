"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // আপনার প্রজেক্টে react-hot-toast বা sonner যেটি আছে সেটি ব্যবহার করবেন

export default function BookingForm({ service }: { service: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // ডামি ইউজার ডেটা (পরে BetterAuth সেশন থেকে আসবে)
  const [formData, setFormData] = useState({
    customerName: "Test Customer",
    customerEmail: "customer@test.com",
    customerPhone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // বুকিং ডেটা তৈরি
      const bookingData = {
        ...formData,
        serviceId: service._id,
        serviceTitle: service.title,
        serviceImage: service.image,
        category: service.category,
        basePrice: service.basePrice,
        technicianName: service.technicianName,
        technicianEmail: service.technicianEmail,
        status: "requested",
        paymentStatus: "unpaid",
      };

      // আপনার ব্যাকএন্ডের বুকিং API-তে পাঠাতে হবে (এটি বানাতে হবে)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        toast.success("Repair request sent successfully!");
        router.push("/dashboard/customer/bookings"); // সফল হলে কাস্টমার ড্যাশবোর্ডে যাবে
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to send request");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name (Read Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" value={formData.customerName} readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
        </div>
        {/* Email (Read Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={formData.customerEmail} readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="text" required placeholder="017XXXXXXXX" 
            value={formData.customerPhone}
            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
          />
        </div>
        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <input 
            type="date" required
            min={new Date().toISOString().split("T")[0]} // আজ বা ভবিষ্যতের তারিখ
            value={formData.preferredDate}
            onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
        <input 
          type="text" required placeholder="House 12, Road 5, Dhanmondi"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
        />
      </div>

      {/* Problem Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description (Min 20 chars)</label>
        <textarea 
          required minLength={20} rows={4} placeholder="Describe the issue in detail..."
          value={formData.problemDescription}
          onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
        />
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Send Repair Request"}
      </button>
    </form>
  );
}