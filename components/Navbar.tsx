"use client";

import Link from "next/link";
import { Wrench, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FixMate</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/services" className="text-gray-600 hover:text-indigo-600 font-medium">Services</Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium">About</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                
                {/* User Info Section */}
                <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                    {user.name?.charAt(0) || <User className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{(user as any).role || "Customer"}</span>
                  </div>
                </div>

                <Link href="/dashboard" className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-medium hover:bg-indigo-100 transition">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-medium flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-600 hover:text-indigo-600 font-medium">Sign In</Link>
                <Link href="/sign-up" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2">
          <Link href="/" className="block py-2 text-gray-600">Home</Link>
          <Link href="/services" className="block py-2 text-gray-600">Services</Link>
          <Link href="/about" className="block py-2 text-gray-600">About</Link>
          
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                    {user.name?.charAt(0) || <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{(user as any).role || "Customer"}</p>
                  </div>
                </div>
                <Link href="/dashboard" className="block py-2 text-center bg-indigo-50 text-indigo-700 rounded-lg">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-center py-2 text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="block py-2 text-center text-gray-600 border border-gray-200 rounded-lg">Sign In</Link>
                <Link href="/sign-up" className="block py-2 text-center bg-indigo-600 text-white rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}