"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/verify?session_id=${sessionId}`);
        const data = await res.json();
        
        if (res.ok && data.session?.payment_status === 'paid') {
          setSuccess(true);
          setAmount(data.session.amount_total / 100);
        } else {
          setSuccess(false);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p>Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
        {success ? (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your payment has been processed securely.</p>
            <p className="text-lg font-bold mb-6">Amount: ${amount.toFixed(2)}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
            <p className="text-gray-600 mb-6">We couldn't verify your payment. Please check your bookings.</p>
          </>
        )}
        <Link href="/dashboard/customer/bookings" className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
          Back to My Bookings
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}