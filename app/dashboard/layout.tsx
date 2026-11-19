"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Users,
  Wrench,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

const menuByRole = {
  admin: [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "All Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Services", href: "/dashboard/admin/services", icon: Wrench },
    { name: "Bookings", href: "/dashboard/admin/bookings", icon: Calendar },
    {
      name: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
  ],
  technician: [
    {
      name: "Overview",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      name: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: Wrench,
    },
    {
      name: "My Services",
      href: "/dashboard/technician/my-services",
      icon: FileText,
    },
    {
      name: "Manage Requests",
      href: "/dashboard/technician/requests",
      icon: Calendar,
    },
  ],
  customer: [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/customer/bookings", icon: Calendar },
    { name: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
  ],
};

type DashboardRole = keyof typeof menuByRole;

function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "admin" || value === "technician" || value === "customer";
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending, error } = useSession();
  const user = session?.user;
  const isSignedIn = Boolean(user);

  useEffect(() => {
    if (!isPending && !error && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isPending, error, isSignedIn, router]);

  if (error) {
    return (
      <p className="py-20 text-center text-gray-500" role="alert">
        Could not verify your session. Please refresh and try again.
      </p>
    );
  }

  if (isPending || !user) {
    return (
      <p className="py-20 text-center text-gray-500" role="status">
        {isPending ? "Checking your session…" : "Redirecting to sign in…"}
      </p>
    );
  }

  const role = (user as typeof user & { role?: string }).role;
  const dashboardSection = pathname.split("/")[2];

  if (isDashboardRole(dashboardSection) && role !== dashboardSection) {
    const backHref = isDashboardRole(role) ? `/dashboard/${role}` : "/";

    return (
      <div className="px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-gray-600">
          Your account does not have permission to open this dashboard.
        </p>
        <Link
          href={backHref}
          className="mt-4 inline-block font-medium text-indigo-600 hover:underline"
        >
          {isDashboardRole(role) ? "Go to my dashboard" : "Back to Home"}
        </Link>
      </div>
    );
  }

  const menuItems = isDashboardRole(role) ? menuByRole[role] : [];

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menuItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {name}
              </Link>
            );
          })}

          <div className="mt-6 border-t border-gray-100 pt-6">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
