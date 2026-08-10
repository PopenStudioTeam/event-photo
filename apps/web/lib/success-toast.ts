import { toast } from "@/components/ui/toast";

export function showSuccessToast(message: string, description?: string) {
  if (typeof window === "undefined") return;

  toast.add({
    title: message,
    description,
    type: "success",
    timeout: 4000,
  });
}
