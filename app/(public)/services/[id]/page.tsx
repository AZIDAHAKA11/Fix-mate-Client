"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import BookingModal from "@/components/BookingModal";
import { Loader2, Wrench, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/services/${id}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(() => toast.error("Service not found"))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  if (!service) return <div className="text-center py-20 text-gray-500">Service not found.</div>;

  const handleRequestClick = () => {
    if (!session?.user) {
      toast.error("Please login to request a repair");
      router.push(`/sign-in?redirect=/services/${id}`);
    } else if ((session.user as any).role !== "customer") {
      toast.error("Only customers can request a repair");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <img src={service.image} alt={service.title} className="w-full h-[400px] object-cover rounded-2xl" />
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <p className="text-indigo-600 font-semibold mb-6">{service.category}</p>
          
          <div className="space-y-4 mb-8 text-gray-600">
            <p className="flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-500" /> {service.serviceArea} • {service.serviceMode}</p>
            <p className="flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /> Est. Duration: {service.estimatedDuration}</p>
            <p className="flex items-center gap-2"><Wrench className="w-5 h-5 text-indigo-500" /> Technician: {service.technicianName}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <p className="text-sm text-gray-500 mb-1">Starting Price</p>
            <p className="text-4xl font-bold text-gray-900">${service.basePrice}</p>
          </div>

          <button onClick={handleRequestClick} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition">
            Request Repair
          </button>
        </div>
      </div>

      {isModalOpen && <BookingModal service={service} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}