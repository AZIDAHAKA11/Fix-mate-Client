"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyServicesPage() {
  const { data: session, isPending } = useSession();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`http://localhost:5000/api/services?technicianEmail=${session.user.email}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending) {
      if (!session) window.location.href = "/sign-in";
      else fetchServices();
    }
  }, [isPending, session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Service deleted successfully");
        fetchServices();
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });
      if (res.ok) {
        toast.success(`Service ${!currentStatus ? 'enabled' : 'disabled'}`);
        fetchServices();
      }
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  if (isPending || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Services</h1>
        <Link href="/dashboard/technician/add-service" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          + Add New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 mb-4">You haven't added any services yet.</p>
          <Link href="/dashboard/technician/add-service" className="text-indigo-600 font-semibold hover:underline">
            Create your first service
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 flex-1 w-full">
                <img 
                  src={service.image || "https://via.placeholder.com/100"} 
                  alt={service.title} 
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.category} • ${service.basePrice} • {service.serviceMode}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      service.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      service.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {service.approvalStatus.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      service.isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <button 
                  onClick={() => toggleAvailability(service._id, service.isAvailable)}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition ${
                    service.isAvailable ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {service.isAvailable ? 'Disable' : 'Enable'}
                </button>
                
                <button className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 rounded-lg transition">
                  <Edit className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => handleDelete(service._id)}
                  className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}