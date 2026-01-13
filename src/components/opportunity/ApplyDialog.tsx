import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplyToRequest } from "@/hooks/useApplications";
import { Loader2 } from "lucide-react";

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    id: string;
    service_category: string;
    event_title: string | null;
    offered_amount: number;
    talents_needed: number | null;
  } | null;
  talentId: string;
}

export const ApplyDialog = ({ open, onOpenChange, request, talentId }: ApplyDialogProps) => {
  const [message, setMessage] = useState("");
  const applyMutation = useApplyToRequest();

  const handleApply = () => {
    if (!request) return;
    
    applyMutation.mutate(
      { requestId: request.id, talentId, message },
      {
        onSuccess: () => {
          setMessage("");
          onOpenChange(false);
        },
      }
    );
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-display">Apply to Request</DialogTitle>
          <DialogDescription>
            Submit your application for "{request.event_title || request.service_category}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{request.service_category}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-muted-foreground">Budget</p>
              <p className="font-medium">${request.offered_amount}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why you're a good fit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="hero" 
            onClick={handleApply}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
