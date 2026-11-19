"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

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
  // FETCH ALL USERS
  // ============================================
  const fetchUsers = async () => {
    try {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();

      setUsers(data);

    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");

    } finally {
      setIsLoading(false);
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

      fetchUsers();
    }
  }, [session, isPending, router]);

  // ============================================
  // UPDATE USER ROLE
  // ============================================
  const handleRoleChange = async (
    userId: string,
    newRole: string
  ) => {
    try {
      setUpdatingUser(userId);

      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}/role`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      toast.success("User role updated successfully");

      // Refresh users after successful update
      await fetchUsers();

    } catch (error: any) {
      console.error("Role update error:", error);

      toast.error(
        error.message || "Failed to update user role"
      );

      // Reload users to restore the original role
      await fetchUsers();

    } finally {
      setUpdatingUser(null);
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (isPending || isLoading) {
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
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Manage Users
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-sm">
                  User
                </th>

                <th className="p-4 font-semibold text-sm">
                  Email
                </th>

                <th className="p-4 font-semibold text-sm">
                  Role
                </th>

                <th className="p-4 font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {users.map((u) => {

                const isSelf =
                  u.email === session?.user?.email;

                const isAdmin =
                  u.role === "admin";

                const isUpdating =
                  updatingUser === u._id;

                return (
                  <tr
                    key={u._id}
                    className="border-b border-gray-100"
                  >

                    {/* USER NAME */}
                    <td className="p-4 font-medium text-sm">
                      {u.name}
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 text-sm text-gray-600">
                      {u.email}
                    </td>

                    {/* ROLE */}
                    <td className="p-4">

                      <span
                        className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase"
                      >
                        {u.role}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="p-4">

                      {isSelf ? (

                        <span className="text-xs text-gray-500">
                          Your account
                        </span>

                      ) : isAdmin ? (

                        <span className="text-xs text-gray-500">
                          <Shield className="w-4 h-4 inline mr-1" />
                          Admin protected
                        </span>

                      ) : (

                        <div className="flex items-center gap-2">

                          <select
                            value={u.role}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleRoleChange(
                                u._id,
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded p-1 text-sm disabled:opacity-50"
                          >

                            <option value="customer">
                              Customer
                            </option>

                            <option value="technician">
                              Technician
                            </option>

                          </select>

                          {isUpdating && (
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                          )}

                        </div>

                      )}

                    </td>

                  </tr>
                );
              })}

              {/* EMPTY STATE */}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-8 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}
