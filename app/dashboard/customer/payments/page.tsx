"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function CustomerPaymentsPage() {
  const { data: session, isPending } = useSession();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.email) return;
      
      try {
        const res = await fetch(`http://localhost:5000/api/payments/my?email=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (error) {
        console.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      if (!session) window.location.href = "/sign-in";
      else fetchPayments();
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Technician</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Transaction ID</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-900 font-medium">{payment.serviceTitle}</td>
                  <td className="p-4 text-sm text-gray-600">{payment.technicianName}</td>
                  <td className="p-4 text-sm font-bold text-gray-900">${payment.amount}</td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{payment.transactionId?.slice(0, 15)}...</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(payment.paidAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}// update
