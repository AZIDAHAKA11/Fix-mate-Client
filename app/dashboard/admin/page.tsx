"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Users,
  Wrench,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ============================================
  // GET JWT TOKEN
  // ============================================
  const getToken = async () => {
    const tokenRes = await fetch("/api/auth/token");

    if (!tokenRes.ok) {
      throw new Error("Failed to get authentication token");
    }

    const tokenData = await tokenRes.json();

    return tokenData.token;
  };

  // ============================================
  // FETCH DASHBOARD STATISTICS
  // ============================================
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/sign-in");
      return;
    }

    if ((session.user as any).role !== "admin") {
      router.push("/");
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(false);

        // Get JWT token
        const token = await getToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch all data
        const [usersRes, servicesRes, bookingsRes] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/admin/users",
              { headers }
            ),

            fetch(
              "http://localhost:5000/api/admin/services",
              { headers }
            ),

            fetch(
              "http://localhost:5000/api/admin/bookings",
              { headers }
            ),
          ]);

        // Check API responses
        if (
          !usersRes.ok ||
          !servicesRes.ok ||
          !bookingsRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        // Convert responses to JSON
        const [users, services, bookings] =
          await Promise.all([
            usersRes.json(),
            servicesRes.json(),
            bookingsRes.json(),
          ]);

        // Update statistics
        setStats({
          users: users.length,
          services: services.length,
          bookings: bookings.length,
        });

      } catch (error) {
        console.error("Failed to fetch stats:", error);

        setError(true);

        toast.error("Failed to load dashboard statistics");

      } finally {
        setLoading(false);
      }
    };

    fetchStats();

  }, [session, isPending, router]);

  // ============================================
  // LOADING
  // ============================================
  if (isPending || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ============================================
  // CHART DATA
  // ============================================
  const chartData = [
    {
      name: "Total Users",
      count: stats.users,
    },
    {
      name: "Total Services",
      count: stats.services,
    },
    {
      name: "Total Bookings",
      count: stats.bookings,
    },
  ];

  // ============================================
  // UI
  // ============================================
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Admin Overview
      </h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load dashboard statistics.
          Please refresh the page.
        </div>
      )}

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* TOTAL USERS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">

          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {error ? "--" : stats.users}
            </p>
          </div>

        </div>

        {/* TOTAL SERVICES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">

          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Services
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {error ? "--" : stats.services}
            </p>
          </div>

        </div>

        {/* TOTAL BOOKINGS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">

          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Bookings
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {error ? "--" : stats.bookings}
            </p>
          </div>

        </div>

      </div>

      {/* PLATFORM OVERVIEW CHART */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

        <h2 className="text-lg font-bold mb-4">
          Platform Overview
        </h2>

        {!error && (
          <div className="h-[300px] w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "transparent",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Count"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

    </div>
  );
}