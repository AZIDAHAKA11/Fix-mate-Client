import Link from "next/link";
import { MapPin, Wrench, Clock } from "lucide-react";

interface ServiceCardProps {
  service: {
    _id: string;
    title: string;
    category: string;
    image: string;
    basePrice: number;
    estimatedDuration: string;
    serviceMode: string;
    serviceArea: string;
    technicianName: string;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={service.image || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600"} 
          alt={service.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{service.category}</span>
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{service.title}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5" /> {service.serviceArea} • {service.serviceMode}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">${service.basePrice}</span>
            <span className="text-xs text-gray-500 ml-1">start</span>
          </div>
          <Link 
            href={`/services/${service._id}`}
            className="bg-indigo-50 text-indigo-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}