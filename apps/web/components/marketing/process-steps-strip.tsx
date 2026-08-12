export type ProcessStep = {
  number: string;
  title: string;
  text: string;
};

export function ProcessStepsStrip({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-3 lg:px-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-110">
              {step.number}
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">
                {step.title}
              </div>
              <div className="mt-1 text-xs leading-5 text-muted-foreground">
                {step.text}
              </div>
            </div>
            {index < steps.length - 1 && (
              <span className="absolute -right-4 top-5 hidden text-muted-foreground/50 md:block">
                ···
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
