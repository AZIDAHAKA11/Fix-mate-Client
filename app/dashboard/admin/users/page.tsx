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

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && (!session || (session.user as any).role !== "admin")) {
      router.push("/sign-in");
    } else if (session) {
      fetchUsers();
    }
  }, [session, isPending, router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("User role updated");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  if (isPending || isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-sm">User</th>
              <th className="p-4 font-semibold text-sm">Email</th>
              <th className="p-4 font-semibold text-sm">Role</th>
              <th className="p-4 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100">
                <td className="p-4 font-medium text-sm">{u.name}</td>
                <td className="p-4 text-sm text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    onChange={(e) => handleRoleChange(u._id, e.target.value)} 
                    defaultValue={u.role}
                    className="border border-gray-300 rounded p-1 text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}