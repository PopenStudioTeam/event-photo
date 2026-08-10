import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import type { UseCase } from "@/lib/use-cases-data";

const miniSteps = [
  {
    title: "Create your event",
    text: "Set up your gallery in under two minutes.",
  },
  {
    title: "Share your QR code",
    text: "Print it, send it, or display it on a screen.",
  },
  {
    title: "Watch memories arrive",
    text: "Every guest upload lands in your gallery instantly.",
  },
];

export function UseCasePage({ useCase }: { useCase: UseCase }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#262125]">
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div
            className="inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]"
            style={{ backgroundColor: useCase.accent }}
          >
            {useCase.heroLabel}
          </div>

          <h1 className="mt-7 text-5xl leading-[0.98] sm:text-6xl">
            {useCase.headline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
            {useCase.subheadline}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full rounded-full bg-[#262125] px-7 text-white hover:bg-black sm:w-auto"
              >
                Create your event
                <span className="ml-2">↗</span>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-black/10 bg-white/65 px-7 sm:w-auto"
              >
                See pricing
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-neutral-600 sm:text-base">
            {useCase.description}
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {useCase.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.75rem] p-6"
                style={{ backgroundColor: useCase.accent }}
              >
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-70">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-black/5 bg-white/70 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
            {miniSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#262125] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-bold">{step.title}</div>
                  <div className="mt-1 text-xs leading-5 text-neutral-600">
                    {step.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[#262125] px-6 py-16 text-center text-white sm:px-10 sm:py-20">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Ready to start your {useCase.navLabel} gallery?
            </h2>
            <Link href="/dashboard" className="mt-8 inline-block">
              <Button
                size="lg"
                className="rounded-full bg-white px-7 text-[#262125] hover:bg-white/90"
              >
                Create your event
                <span className="ml-2">↗</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white/70 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Event Photo</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-black">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-black">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}