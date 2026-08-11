import { UseCasePage } from "@/components/use-case-page";
import { useCases } from "@/lib/use-cases-data";

export default function FamilyReunionsPage() {
  return (
    <UseCasePage
      useCase={useCases.find((useCase) => useCase.slug === "family-reunions")!}
    />
  );
}