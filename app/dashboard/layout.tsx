"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Home, LayoutDashboard, Wrench, Calendar, FileText, Users, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user;
  const role = (user as any)?.role || "customer";

  const getMenuItems = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
          { name: "All Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5" /> },
          { name: "Services", href: "/dashboard/admin/services", icon: <Wrench className="w-5 h-5" /> },
          { name: "Bookings", href: "/dashboard/admin/bookings", icon: <Calendar className="w-5 h-5" /> },
          { name: "Transactions", href: "/dashboard/admin/transactions", icon: <CreditCard className="w-5 h-5" /> },
        ];
      case "technician":
        return [
          { name: "Overview", href: "/dashboard/technician", icon: <LayoutDashboard className="w-5 h-5" /> },
          { name: "Add Service", href: "/dashboard/technician/add-service", icon: <Wrench className="w-5 h-5" /> },
          { name: "My Services", href: "/dashboard/technician/my-services", icon: <FileText className="w-5 h-5" /> },
          { name: "Manage Requests", href: "/dashboard/technician/requests", icon: <Calendar className="w-5 h-5" /> },
        ];
      default:
        return [
          { name: "Overview", href: "/dashboard/customer", icon: <LayoutDashboard className="w-5 h-5" /> },
          { name: "My Bookings", href: "/dashboard/customer/bookings", icon: <Calendar className="w-5 h-5" /> },
          { name: "Payments", href: "/dashboard/customer/payments", icon: <CreditCard className="w-5 h-5" /> },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Navbar at the top */}
      <Navbar />

      {/* Main Content Area: Sidebar + Page Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}// update
