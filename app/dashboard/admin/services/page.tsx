"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Check, X } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/services");
      if (res.ok) setServices(await res.json());
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleApproval = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/services/${id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Service ${status}`);
        fetchServices();
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Service Approval</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-sm">Service</th>
              <th className="p-4 font-semibold text-sm">Technician</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-b border-gray-100">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={s.image} className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium text-sm">{s.title}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{s.technicianName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    s.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                    s.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{s.approvalStatus}</span>
                </td>
                <td className="p-4 flex gap-2">
                  {s.approvalStatus === 'pending' && (
                    <>
                      <button onClick={() => handleApproval(s._id, 'approved')} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check className="w-4 h-4" /></button>
                      <button onClick={() => handleApproval(s._id, 'rejected')} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"><X className="w-4 h-4" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}// update
