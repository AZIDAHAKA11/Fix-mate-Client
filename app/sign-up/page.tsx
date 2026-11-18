"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";

type Role = "customer" | "technician";

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 6) errors.push("At least 6 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function onPasswordChange(value: string) {
    setPassword(value);
    setPasswordErrors(validatePassword(value));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      toast.error("Please fix the password requirements");
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      // @ts-expect-error - role is a custom additional field
      role,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Could not create account");
      return;
    }

    toast.success("Account created successfully!");
    router.push(`/dashboard/${role}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-center text-2xl font-bold">Create your FixMate account</h1>
      <p className="mb-6 mt-1 text-center text-sm text-gray-500">
        Join as a customer to book repairs, or a technician to offer services.
      </p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-6">
        <label className="block text-sm font-medium">
          Full Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>

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
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>

        {password.length > 0 && passwordErrors.length > 0 && (
          <ul className="list-disc space-y-0.5 pl-5 text-xs text-red-600">
            {passwordErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div>
          <p className="mb-2 text-sm font-medium">I am a</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                role === "customer" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("technician")}
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                role === "technician" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300"
              }`}
            >
              Technician
            </button>
          </div>
        </div>

        <button disabled={loading} className="w-full rounded-md bg-blue-600 py-2 font-medium text-white disabled:opacity-60">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-blue-600">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}