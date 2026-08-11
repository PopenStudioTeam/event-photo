export const testimonialCategoryLabels: Record<string, string> = {
  wedding: "Wedding",
  party: "Party/Celebration",
  birthday: "Birthday",
  corporate: "Corporate",
  other: "Other",
};

export function testimonialCategoryLabel(category: string) {
  return testimonialCategoryLabels[category] ?? "Other";
}
