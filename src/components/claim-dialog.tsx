import { useState } from "react";
import { Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fileClaim } from "@/lib/annotations";

export function ClaimDialog({ annotationId }: { annotationId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fileClaim({
        data: {
          annotationId,
          claimantName: name,
          claimantEmail: email,
          reason,
        },
      });
      toast.success("Claim filed. The team will review it.");
      setOpen(false);
      setName("");
      setEmail("");
      setReason("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not file claim");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger" size="sm">
          <Scale className="h-3.5 w-3.5" />
          File a claim
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File a fair-use claim</DialogTitle>
          <DialogDescription>
            Every annotation links back to its source. If you believe this clip
            misuses your work, submit a claim for review.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-fg-muted)]">Your name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-fg-muted)]">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--color-fg-muted)]">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Describe the issue and your relationship to the original work."
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Submitting…" : "Submit claim"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
