"use client";

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-6">You cancelled the payment. Your card was not charged.</p>
        <button onClick={() => router.push("/dashboard/customer/bookings")} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">
          Try Again
        </button>
      </div>
    </div>
  );
}