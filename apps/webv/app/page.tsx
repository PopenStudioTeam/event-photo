import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* top nav */}
      <header className="flex items-center justify-between px-4 py-3 md:px-8 border-b">
        <span className="font-semibold text-lg">Event Photo</span>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">Dashboard</Button>
        </Link>
      </header>

      {/* main content */}
      <main className="flex-1">
        {/* hero */}
        <section className="px-4 py-10 md:px-8 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Collect event photos from guests with one link
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Create an event, share a QR or link, guests upload photos and videos from their phone.
              You get a clean gallery and can download everything in original quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link href="/dashboard">
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

        {/* how it works */}
        <section className="px-4 pb-10 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">How it works</h2>
            <div className="grid gap-4 md:grid-cols-3">
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
              <Card>
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

        {/* features */}
        <section className="px-4 pb-12 md:px-8">
          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Made for events</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Weddings, birthdays, conferences — anywhere you want guests to share what they capture.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unique event link and QR code</li>
                <li>• Mobile-first upload flow (Safari iOS, Chrome Android)</li>
                <li>• Photo and video support</li>
                <li>• Organizer dashboard to manage uploads</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Backend-first MVP</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Built on S3-compatible storage and a robust database so your files are safe and easy to download.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Direct uploads to object storage</li>
                <li>• Original resolution files</li>
                <li>• Server-side validation and error handling</li>
                <li>• Ready for future features like slideshows and moderation</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="px-4 py-4 md:px-8 border-t text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Event Photo</span>
          <span>Built for fast event photo collection MVP.</span>
        </div>
      </footer>
    </div>
  );
}