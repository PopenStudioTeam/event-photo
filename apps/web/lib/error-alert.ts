type ErrorAlertListener = (message: string) => void;

let listener: ErrorAlertListener | null = null;

export function setErrorAlertListener(next: ErrorAlertListener | null) {
  listener = next;
}

export function showErrorAlert(message: string) {
  if (typeof window === "undefined") return;
  listener?.(message);
}
