import { UseCasePage } from "@/components/use-case-page";
import { useCases } from "@/lib/use-cases-data";

export default function CorporatePage() {
  return (
    <UseCasePage
      useCase={useCases.find((useCase) => useCase.slug === "corporate")!}
    />
  );
}