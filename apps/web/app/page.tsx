import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 md:px-8">
        <span className="text-base font-semibold sm:text-lg">Event Photo</span>
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="shrink-0">
            Dashboard
          </Button>
        </Link>
      </header>

      <main className="flex-1">
        <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
              Collect event photos from guests with one link
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Create an event, share a QR or link, guests upload photos and videos from their phone.
              You get a clean gallery and can download everything in original quality.
            </p>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Open dashboard
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn more
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 md:px-8 md:pb-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-lg font-semibold sm:text-xl md:text-2xl">
              How it works
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">1. Create event</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Organizer creates an event, gets a unique link and QR code automatically.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2. Share link or QR</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Guests scan the QR or open the link, no app or account needed.
                </CardContent>
              </Card>
              <Card className="sm:col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">3. Upload & download</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Guests upload photos/videos, you see them in the dashboard and download a ZIP.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 pb-10 sm:px-6 md:px-8 md:pb-12">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-base font-semibold sm:text-lg md:text-xl">
                Made for events
              </h3>
              <p className="mb-2 text-sm text-muted-foreground">
                Weddings, birthdays, conferences — anywhere you want guests to share what they capture.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Unique event link and QR code</li>
                <li>• Mobile-first upload flow (Safari iOS, Chrome Android)</li>
                <li>• Photo and video support</li>
                <li>• Organizer dashboard to manage uploads</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold sm:text-lg md:text-xl">
                Backend-first MVP
              </h3>
              <p className="mb-2 text-sm text-muted-foreground">
                Built on S3-compatible storage and a robust database so your files are safe and easy to download.
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Direct uploads to object storage</li>
                <li>• Original resolution files</li>
                <li>• Server-side validation and error handling</li>
                <li>• Ready for future features like slideshows and moderation</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-4 text-xs text-muted-foreground sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Event Photo</span>
          <span>Built for fast event photo collection MVP.</span>
        </div>
      </footer>
    </div>
  );
}
