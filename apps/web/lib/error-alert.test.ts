import { afterEach, describe, expect, it, vi } from "vitest";
import { setErrorAlertListener, showErrorAlert } from "./error-alert";

afterEach(() => {
  setErrorAlertListener(null);
});

describe("error alert", () => {
  it("notifies the registered listener", () => {
    const listener = vi.fn();
    setErrorAlertListener(listener);
    showErrorAlert("Upload failed");
    expect(listener).toHaveBeenCalledWith("Upload failed");
  });

  it("does nothing when no listener is set", () => {
    expect(() => showErrorAlert("Upload failed")).not.toThrow();
  });
});
