"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardRedirectPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/sign-in");
        return;
      }

      const role = (session.user as any).role;
      
      
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "technician") router.push("/dashboard/technician");
      else router.push("/dashboard/customer");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );
}