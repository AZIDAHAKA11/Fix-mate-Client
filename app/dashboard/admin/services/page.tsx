"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminServicesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingService, setUpdatingService] = useState<string | null>(null);

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
  // FETCH SERVICES
  // ============================================
  const fetchServices = async () => {
    try {
      const token = await getToken();

      const res = await fetch(
        "http://localhost:5000/api/admin/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await res.json();

      setServices(data);

    } catch (error) {
      console.error("Fetch services error:", error);
      toast.error("Failed to load services");

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // AUTHENTICATION CHECK
  // ============================================
  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/sign-in");
        return;
      }

      if ((session.user as any).role !== "admin") {
        router.push("/");
        return;
      }

      fetchServices();
    }
  }, [session, isPending, router]);

  // ============================================
  // APPROVE / REJECT SERVICE
  // ============================================
  const handleApproval = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingService(id);

      toast.loading("Updating status...", {
        id: "approval",
      });

      const token = await getToken();

      const res = await fetch(
        `http://localhost:5000/api/admin/services/${id}/approval`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            approvalStatus: status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update service"
        );
      }

      toast.success(`Service ${status} successfully`, {
        id: "approval",
      });

      await fetchServices();

    } catch (error: any) {
      console.error("Approval error:", error);

      toast.error(
        error.message || "Something went wrong",
        {
          id: "approval",
        }
      );

    } finally {
      setUpdatingService(null);
    }
  };

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
  // UI
  // ============================================
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Service Approval
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

        <table className="w-full text-left border-collapse min-w-[700px]">

          {/* TABLE HEADER */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">

              <th className="p-4 font-semibold">
                Service
              </th>

              <th className="p-4 font-semibold">
                Technician
              </th>

              <th className="p-4 font-semibold">
                Status
              </th>

              <th className="p-4 font-semibold text-center">
                Action
              </th>

            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>

            {services.map((service) => (
              <tr
                key={service._id}
                className="border-b border-gray-50 hover:bg-gray-50 transition"
              >

                {/* SERVICE */}
                <td className="p-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        service.image ||
                        "https://placehold.co/40x40"
                      }
                      alt={service.title || "Service"}
                      className="w-10 h-10 rounded object-cover"
                    />

                    <span className="font-medium text-gray-900">
                      {service.title}
                    </span>

                  </div>

                </td>

                {/* TECHNICIAN */}
                <td className="p-4 text-sm text-gray-600">
                  {service.technicianName || "N/A"}
                </td>

                {/* STATUS */}
                <td className="p-4">

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      service.approvalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : service.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {service.approvalStatus || "pending"}
                  </span>

                </td>

                {/* ACTION */}
                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    {service.approvalStatus === "pending" && (
                      <>
                        {/* APPROVE */}
                        <button
                          onClick={() =>
                            handleApproval(
                              service._id,
                              "approved"
                            )
                          }
                          disabled={updatingService === service._id}
                          className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition disabled:opacity-50"
                          title="Approve"
                        >
                          {updatingService === service._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Check className="w-5 h-5" />
                          )}
                        </button>

                        {/* REJECT */}
                        <button
                          onClick={() =>
                            handleApproval(
                              service._id,
                              "rejected"
                            )
                          }
                          disabled={updatingService === service._id}
                          className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}

                  </div>

                </td>

              </tr>
            ))}

            {/* EMPTY STATE */}
            {services.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-500"
                >
                  No services found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}