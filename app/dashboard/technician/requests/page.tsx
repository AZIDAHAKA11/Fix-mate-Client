"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function TechnicianRequestsPage() {
  const { data: session, isPending } = useSession();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/technician?email=${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch requests");
      }
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        window.location.href = "/sign-in";
      } else {
        fetchRequests();
      }
    }
  }, [isPending, session]);

  const handleStatusChange = async (id: string, status: string, finalAmount?: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, finalAmount }),
      });
      
      if (res.ok) {
        toast.success(`Job marked as ${status}`);
        fetchRequests();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isPending || isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Manage Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No repair requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white border border-gray-200 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{req.serviceTitle}</h3>
                  <p className="text-sm text-gray-500">Customer: {req.customerName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3"/> {req.customerPhone}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {req.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  req.status === 'requested' ? 'bg-blue-100 text-blue-700' :
                  req.status === 'accepted' ? 'bg-indigo-100 text-indigo-700' :
                  req.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                  req.status === 'completed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{req.status}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-4">
                <strong>Problem:</strong> {req.problemDescription}
              </div>

              <div className="flex gap-2">
                {req.status === 'requested' && (
                  <>
                    <button onClick={() => handleStatusChange(req._id, 'accepted')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Accept</button>
                    <button onClick={() => handleStatusChange(req._id, 'rejected')} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition">Reject</button>
                  </>
                )}
                {req.status === 'accepted' && (
                  <button onClick={() => handleStatusChange(req._id, 'in-progress')} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition">Start Work</button>
                )}
                {req.status === 'in-progress' && (
                  <button onClick={() => {
                    const amount = prompt("Enter final amount:", req.basePrice);
                    if (amount) handleStatusChange(req._id, 'completed', Number(amount));
                  }} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}// update
