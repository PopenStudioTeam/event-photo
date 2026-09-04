import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/toast", () => ({
  toast: { add: vi.fn() },
}));

import { toast } from "@/components/ui/toast";
import { showSuccessToast } from "./success-toast";

afterEach(() => {
  vi.mocked(toast.add).mockReset();
});

describe("showSuccessToast", () => {
  it("adds a success toast", () => {
    showSuccessToast("Saved", "Your event was updated");
    expect(toast.add).toHaveBeenCalledWith({
      title: "Saved",
      description: "Your event was updated",
      type: "success",
      timeout: 4000,
    });
  });
});
