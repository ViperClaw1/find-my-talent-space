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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAcceptApplication } from "@/hooks/useApplications";
import { Loader2, CheckCircle2 } from "lucide-react";

interface AcceptApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  requestId: string;
  talentName: string;
  offeredAmount: number;
}

export const AcceptApplicationDialog = ({
  open,
  onOpenChange,
  applicationId,
  requestId,
  talentName,
  offeredAmount,
}: AcceptApplicationDialogProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const acceptMutation = useAcceptApplication();

  const serviceFee = offeredAmount * 0.1;
  const totalAmount = offeredAmount + serviceFee;

  const handleAccept = () => {
    acceptMutation.mutate(
      { applicationId, requestId },
      {
        onSuccess: () => {
          setAgreedToTerms(false);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Accept Application
          </DialogTitle>
          <DialogDescription>
            Confirm acceptance of {talentName}'s application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Talent</span>
              <span className="font-medium">{talentName}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Offered Amount</span>
              <span className="font-medium">${offeredAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Fee (10%)</span>
              <span className="font-medium">${serviceFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
              I agree to the terms and conditions. By accepting this application, I confirm that the payment will be processed and the talent will be booked for this request.
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleAccept}
            disabled={!agreedToTerms || acceptMutation.isPending}
          >
            {acceptMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm & Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
