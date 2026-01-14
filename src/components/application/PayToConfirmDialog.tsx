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
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { useConfirmPayment } from "@/hooks/useApplications";

interface PayToConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  requestId: string;
  serviceCategory: string;
  eventTitle: string | null;
  offeredAmount: number;
  selectedSlot?: string;
  isTimeSlot?: boolean;
  tierId?: string | null;
  slotIndex?: number | null;
}

export const PayToConfirmDialog = ({
  open,
  onOpenChange,
  applicationId,
  requestId,
  serviceCategory,
  eventTitle,
  offeredAmount,
  selectedSlot,
  isTimeSlot,
  tierId,
  slotIndex,
}: PayToConfirmDialogProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const confirmMutation = useConfirmPayment();

  const serviceFee = offeredAmount * 0.1;
  const totalAmount = offeredAmount + serviceFee;

  const handleConfirm = () => {
    confirmMutation.mutate(
      { 
        applicationId, 
        requestId,
        tierId: tierId || null,
        slotIndex: slotIndex ?? null,
      },
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
            <CreditCard className="w-5 h-5 text-primary" />
            Confirm Payment
          </DialogTitle>
          <DialogDescription>
            Complete payment to confirm your booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{eventTitle || serviceCategory}</span>
            </div>
            {selectedSlot && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-medium">{selectedSlot}</span>
              </div>
            )}
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
              I agree to the terms and conditions. By confirming, I authorize the payment and understand this booking is binding.
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!agreedToTerms || confirmMutation.isPending}
          >
            {confirmMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Confirm & Pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};