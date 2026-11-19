import Link from "next/link";
import { Wrench, ShieldCheck, Clock, CheckCircle } from "lucide-react";

async function getFeaturedServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services?sort=newest`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 6); 
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const services = await getFeaturedServices();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Broken Device? <br />
              <span className="text-indigo-600">Get It Fixed</span> by Verified Technicians
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Find trusted experts for your device repairs. Book a service, track the progress, and pay only after the job is done.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/services" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                Browse Services
              </Link>
              <Link href="/about" className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition">
                How It Works
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-[450px] h-[450px] rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
                alt="Technician repairing a device" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular repair services, provided by top-rated technicians.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <div key={service._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition">
                  <div>
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                      <img src={service.image || "https://via.placeholder.com/400"} alt={service.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold text-gray-800 px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{service.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Starting at</span>
                      <span className="text-xl font-bold text-indigo-600">${service.basePrice}</span>
                    </div>
                    <Link href={`/services/${service._id}`} className="block w-full text-center bg-indigo-50 text-indigo-700 font-bold py-2 rounded-lg hover:bg-indigo-100 transition">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/services" className="inline-block border-2 border-indigo-600 text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How FixMate Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Wrench />, title: "1. Find a Service", desc: "Browse our verified repair services." },
              { icon: <CheckCircle />, title: "2. Send Request", desc: "Submit your repair request details." },
              { icon: <Clock />, title: "3. Get it Fixed", desc: "Technician accepts and fixes the device." },
              { icon: <ShieldCheck />, title: "4. Pay Securely", desc: "Pay online after the job is completed." },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}