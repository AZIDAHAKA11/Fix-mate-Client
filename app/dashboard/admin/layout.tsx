"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== "admin")) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) return <div className="flex justify-center py-20">Loading...</div>;

  const links = [
    { name: "Overview", href: "/dashboard/admin" },
    { name: "Manage Users", href: "/dashboard/admin/users" },
    { name: "Service Approval", href: "/dashboard/admin/services" },
    { name: "All Bookings", href: "/dashboard/admin/bookings" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2 shrink-0">
        <h2 className="text-xl font-bold mb-6 text-indigo-600">Admin Panel</h2>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`p-3 rounded-lg font-medium transition-colors ${
              pathname === link.href
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}