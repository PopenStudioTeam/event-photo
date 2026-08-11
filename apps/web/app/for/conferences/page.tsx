import { OrganizationUseCasePage } from "@/components/organization-use-case-page";
import { useCases } from "@/lib/use-cases-data";

export default function ConferencesPage() {
  return (
    <OrganizationUseCasePage
      useCase={useCases.find((useCase) => useCase.slug === "conferences")!}
    />
  );
}