import Link from "next/link";
import { Wrench, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function HomePage() {
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
              <Link 
                href="/services" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Browse Services
              </Link>
              <Link 
                href="/about" 
                className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            {/* Placeholder for Hero Image */}
            <div className="w-[400px] h-[400px] bg-indigo-100 rounded-full flex items-center justify-center border-8 border-white shadow-2xl">
              <Wrench className="w-32 h-32 text-indigo-400" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How FixMate Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Wrench />, title: "1. Find a Service", desc: "Browse our verified repair services." },
              { icon: <CheckCircle />, title: "2. Send Request", desc: "Submit your repair request details." },
              { icon: <Clock />, title: "3. Get it Fixed", desc: "Technician accepts and fixes the device." },
              { icon: <ShieldCheck />, title: "4. Pay Securely", desc: "Pay online after the job is completed." },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
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