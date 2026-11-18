"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    const { data, error } = await signIn.email({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Signed in successfully!");

    const redirectTo = searchParams.get("redirect");
    const role = (data?.user as any)?.role ?? "customer";

    if (redirectTo && redirectTo.startsWith("/")) {
      router.push(redirectTo);
    } else {
      router.push(`/dashboard/${role}`);
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-6">
      <label className="block text-sm font-medium">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </label>

      <button disabled={loading} className="w-full rounded-md bg-blue-600 py-2 font-medium text-white disabled:opacity-60">
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-blue-600">
          Sign Up
        </Link>
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-center text-2xl font-bold">Sign in to FixMate</h1>
      <p className="mb-6 mt-1 text-center text-sm text-gray-500">
        Welcome back. Track your repairs or manage your services.
      </p>
      <Suspense fallback={<div className="text-center text-sm text-gray-400">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}