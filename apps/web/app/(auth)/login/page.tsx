"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { saveOrganizer, saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      // TODO: show error
      return;
    }

    const data = await res.json();
    saveToken(data.token);
    saveOrganizer(data.organizer);

    router.push("/dashboard");
  };

  const handleGoogleError = () => {
    // TODO: show error toast
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // TODO: show error
      return;
    }

    const data = await res.json();
    saveToken(data.token);
    saveOrganizer(data.organizer);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel on desktop */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 bg-muted border-r">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Event Photo Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Collect all your guests&apos; photos and videos in one place. Create events, share a link or QR, and download everything from your dashboard.
          </p>
        </div>
      </div>

      {/* Right auth card */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 md:px-8">
        <Card className="w-full max-w-sm border shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl text-foreground">Sign in</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Use Google or your email to access the dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google button block */}
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-muted" />
              <span className="text-xs text-muted-foreground">Or continue with email</span>
              <div className="h-px flex-1 bg-muted" />
            </div>

            {/* Email login form */}
            <form className="space-y-3" onSubmit={handleEmailLogin}>
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full" size="sm">
                Sign in with email
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-between text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Event Photo</span>
            <Link href="/" className="hover:underline">
              Back to site
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}