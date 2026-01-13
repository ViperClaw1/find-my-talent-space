import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Send, User } from "lucide-react";

interface Talent {
  id: string;
  name: string;
  category: string;
  rating: number;
  avatar_initials: string | null;
}

interface DirectRequestConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  offerAmount: string;
  selectedTalent: Talent | null;
}

const SERVICE_FEE_PERCENTAGE = 0.10; // 10% service fee

const DirectRequestConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  offerAmount,
  selectedTalent,
}: DirectRequestConfirmDialogProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const parsedAmount = parseFloat(offerAmount) || 0;
  const serviceFee = parsedAmount * SERVICE_FEE_PERCENTAGE;
  const total = parsedAmount + serviceFee;

  const handleConfirm = () => {
    if (agreedToTerms) {
      onConfirm();
      setAgreedToTerms(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAgreedToTerms(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Confirm Direct Request
          </DialogTitle>
          <DialogDescription>
            Review your request details before submitting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Talent Info */}
          {selectedTalent && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedTalent.name}</p>
                <p className="text-sm text-muted-foreground">{selectedTalent.category}</p>
              </div>
            </div>
          )}

          {/* Summary Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Summary
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Request Type</span>
                <span className="font-medium">Direct Request</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Offer Amount</span>
                <span className="font-medium">${parsedAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee (10%)</span>
                <span className="font-medium">${serviceFee.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              I have read and agree to{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Requestfully's Terms and Conditions
              </a>
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleConfirm}
            disabled={!agreedToTerms}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectRequestConfirmDialog;
