import { UseCasePage } from "@/components/use-case-page";
import { useCases } from "@/lib/use-cases-data";

export default function GraduationsPage() {
  return (
    <UseCasePage
      useCase={useCases.find((useCase) => useCase.slug === "graduations")!}
    />
  );
}