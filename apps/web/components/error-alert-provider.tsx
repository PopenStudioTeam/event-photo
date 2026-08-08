"use client";

import { useEffect, useState } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { setErrorAlertListener } from "@/lib/error-alert";

export function ErrorAlertProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorAlertListener((nextMessage) => setMessage(nextMessage));
    return () => setErrorAlertListener(null);
  }, []);

  return (
    <>
      {children}
      <Dialog
        open={Boolean(message)}
        onOpenChange={(open) => {
          if (!open) setMessage(null);
        }}
      >
        <DialogContent showCloseButton={false} className="max-w-md gap-4">
          <Alert variant="destructive">
            <WarningCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <DialogFooter>
            <Button type="button" size="sm" onClick={() => setMessage(null)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
