"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTransactionsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ============================================
  // GET JWT TOKEN
  // ============================================
  const getToken = async () => {
    const tokenRes = await fetch("/api/auth/token");

    if (!tokenRes.ok) {
      throw new Error("Failed to get authentication token");
    }

    const tokenData = await tokenRes.json();

    return tokenData.token;
  };

  // ============================================
  // FETCH TRANSACTIONS
  // ============================================
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(false);

      // Get JWT token
      const token = await getToken();

      // Fetch transactions
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();

      setTransactions(data);

    } catch (error) {
      console.error("Fetch transactions error:", error);

      setError(true);

      toast.error("Failed to load transactions");

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // AUTHENTICATION CHECK
  // ============================================
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/sign-in");
      return;
    }

    if ((session.user as any).role !== "admin") {
      router.push("/");
      return;
    }

    fetchTransactions();

  }, [session, isPending, router]);

  // ============================================
  // LOADING
  // ============================================
  if (isPending || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ============================================
  // TOTAL REVENUE
  // ============================================
  const totalRevenue = transactions.reduce(
    (sum, tx) => sum + (Number(tx.amount) || 0),
    0
  );

  // ============================================
  // UI
  // ============================================
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Transactions
      </h1>

      {/* TOTAL REVENUE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 inline-block">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>

          <div>

            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {error
                ? "--"
                : `$${totalRevenue.toFixed(2)}`}
            </p>

          </div>

        </div>

      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100">
          <p className="text-red-600">
            Failed to load transactions.
          </p>

          <button
            onClick={fetchTransactions}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!error && transactions.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            No transactions found.
          </p>
        </div>
      )}

      {/* TRANSACTIONS TABLE */}
      {!error && transactions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

          <table className="w-full text-left border-collapse min-w-[900px]">

            {/* TABLE HEADER */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">

                <th className="p-4 font-semibold">
                  Service
                </th>

                <th className="p-4 font-semibold">
                  Customer
                </th>

                <th className="p-4 font-semibold">
                  Technician
                </th>

                <th className="p-4 font-semibold">
                  Amount
                </th>

                <th className="p-4 font-semibold">
                  Transaction ID
                </th>

                <th className="p-4 font-semibold">
                  Date
                </th>

              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>

              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >

                  {/* SERVICE */}
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {tx.serviceTitle || "N/A"}
                  </td>

                  {/* CUSTOMER */}
                  <td className="p-4 text-sm text-gray-600">
                    {tx.customerName || "N/A"}
                  </td>

                  {/* TECHNICIAN */}
                  <td className="p-4 text-sm text-gray-600">
                    {tx.technicianName || "N/A"}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-4 text-sm font-bold text-green-600">
                    ${Number(tx.amount || 0).toFixed(2)}
                  </td>

                  {/* TRANSACTION ID */}
                  <td className="p-4 text-sm text-gray-500 font-mono">
                    {tx.transactionId
                      ? `${tx.transactionId.slice(0, 15)}...`
                      : "N/A"}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-sm text-gray-500">
                    {tx.paidAt
                      ? new Date(tx.paidAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}
