import { OrganizationUseCasePage } from "@/components/organization-use-case-page";
import { useCases } from "@/lib/use-cases-data";

export default function CorporatePage() {
  return (
    <OrganizationUseCasePage
      useCase={useCases.find((useCase) => useCase.slug === "corporate")!}
    />
  );
}