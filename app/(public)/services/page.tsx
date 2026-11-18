import { Search } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; mode?: string; sort?: string };
}) {
  const params = await searchParams;
  
  const search = params?.search || "";
  const category = params?.category || "";
  const mode = params?.mode || "";
  const sort = params?.sort || "";

  // .env.local থেকে URL নিচ্ছে
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  // URL তৈরি করা
  const url = new URL(`${baseUrl}/services`);
  if (search) url.searchParams.append("search", search);
  if (category) url.searchParams.append("category", category);
  if (mode) url.searchParams.append("mode", mode);
  if (sort) url.searchParams.append("sort", sort);

  let services = [];
  try {
    const res = await fetch(url.toString(), { cache: "no-store" }); 
    
    if (res.ok) {
      services = await res.json();
    } else {
      console.error("Backend Error Status:", res.status);
    }
  } catch (error) {
    console.error("Fetch Failed:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Services</h1>
        <p className="text-gray-600">Find trusted experts for your device repairs.</p>
      </div>

      {/* Search & Filter Form */}
      <form action="/services" method="GET" className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        
        <div className="relative w-full md:w-1/3 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Search
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select name="category" defaultValue={category} className="px-4 py-2 border rounded-lg bg-white text-gray-700">
            <option value="">All Categories</option>
            <option value="SMARTPHONE">Smartphone</option>
            <option value="LAPTOP">Laptop</option>
            <option value="TABLET">Tablet</option>
          </select>

          <select name="mode" defaultValue={mode} className="px-4 py-2 border rounded-lg bg-white text-gray-700">
            <option value="">All Modes</option>
            <option value="home-visit">Home Visit</option>
            <option value="drop-off">Drop-off</option>
          </select>

          <select name="sort" defaultValue={sort} className="px-4 py-2 border rounded-lg bg-white text-gray-700">
            <option value="">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
            Apply
          </button>
        </div>
      </form>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
          No services found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}