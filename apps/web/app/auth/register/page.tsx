"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { apiFetch, reportApiError } from "@/lib/api";
import { saveOrganizer, saveToken } from "@/lib/auth";
import { resolvePostAuthPath } from "@/lib/auth-redirect";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch<{
        token: string;
        organizer: { id: string; email: string; onboardingCompleted?: boolean };
        needsOnboarding?: boolean;
      }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      saveToken(res.token);
      const path = await resolvePostAuthPath(res);
      router.push(path);
    } catch (err) {
      reportApiError(err, "Registration failed", { showAuthFailureDetail: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <Card className="w-full max-w-sm bg-slate-900 border-slate-800 p-6">
        <h1 className="text-xl font-semibold mb-4 text-white">Create organizer account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-slate-200">
              Password (min 8 chars)
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
          <p className="text-xs text-slate-400 mt-2">
            Already have an account?{" "}
            <a href="/auth/login" className="underline">
              Login
            </a>
          </p>
        </form>
      </Card>
    </main>
  );
}