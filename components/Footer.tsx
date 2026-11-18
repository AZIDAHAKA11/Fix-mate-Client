import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">FixMate</span>
          </div>
          <p className="text-sm text-gray-400">Your trusted partner for all device repairs.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-indigo-400">Home</Link></li>
            <li><Link href="/services" className="hover:text-indigo-400">Services</Link></li>
            <li><Link href="/about" className="hover:text-indigo-400">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services?category=Smartphone" className="hover:text-indigo-400">Smartphone</Link></li>
            <li><Link href="/services?category=Laptop%20%26%20PC" className="hover:text-indigo-400">Laptop & PC</Link></li>
            <li><Link href="/services?category=AC" className="hover:text-indigo-400">AC Repair</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>support@fixmate.com</li>
            <li>+880 1234 567890</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
        © 2026 FixMate. All rights reserved.
      </div>
    </footer>
  );
}// footer component
