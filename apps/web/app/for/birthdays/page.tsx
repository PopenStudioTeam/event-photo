import { UseCasePage } from "@/components/use-case-page";
import { useCases } from "@/lib/use-cases-data";

export default function BirthdaysPage() {
  return (
    <UseCasePage
      useCase={useCases.find((useCase) => useCase.slug === "birthdays")!}
    />
  );
}