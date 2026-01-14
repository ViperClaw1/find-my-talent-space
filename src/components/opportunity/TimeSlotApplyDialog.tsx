import { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useApplyToRequest, useCreateTimeSlotReservation } from "@/hooks/useApplications";
import { useTimeSlotReservations } from "@/hooks/useTimeSlotReservations";
import { Loader2, Clock, ArrowRight, Check } from "lucide-react";

interface Tier {
  id: string;
  startTime: string;
  endTime: string;
  slots: string;
}

interface TimeSlotApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    id: string;
    service_category: string;
    event_title: string | null;
    offered_amount: number;
    booking_mode: string | null;
    time_type: string | null;
    fixed_start_time: string | null;
    fixed_end_time: string | null;
    fixed_slots: number | null;
    tiers: Tier[] | null;
    user_id: string;
  } | null;
  talentId: string;
  talentName?: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  available: boolean;
  tierId?: string;
  slotIndex?: number;
}

export const TimeSlotApplyDialog = ({ 
  open, 
  onOpenChange, 
  request, 
  talentId,
  talentName 
}: TimeSlotApplyDialogProps) => {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const applyMutation = useApplyToRequest();
  const reserveMutation = useCreateTimeSlotReservation();
  
  // Get current reservations to check availability
  const { data: reservations = [] } = useTimeSlotReservations(request?.id || null);

  // Generate time slots based on request config with availability check
  const timeSlots = useMemo<TimeSlot[]>(() => {
    if (!request) return [];

    // Custom tiers
    if (request.time_type === "tier" && request.tiers && Array.isArray(request.tiers)) {
      return request.tiers.map((tier: Tier) => {
        const totalSlots = parseInt(tier.slots || "0");
        const tierReservations = reservations.filter(r => r.tier_id === tier.id);
        const availableSlots = totalSlots - tierReservations.length;
        
        return {
          id: tier.id,
          startTime: tier.startTime,
          endTime: tier.endTime,
          label: `${tier.startTime} - ${tier.endTime} (${availableSlots} slots left)`,
          available: availableSlots > 0,
          tierId: tier.id,
        };
      });
    }

    // Fixed slots - divide time range equally
    if (request.time_type === "fixed" && request.fixed_start_time && request.fixed_end_time && request.fixed_slots) {
      const slots: TimeSlot[] = [];
      const startParts = request.fixed_start_time.split(":");
      const endParts = request.fixed_end_time.split(":");
      
      const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
      const totalMinutes = endMinutes - startMinutes;
      const slotDuration = Math.floor(totalMinutes / request.fixed_slots);

      for (let i = 0; i < request.fixed_slots; i++) {
        const slotStart = startMinutes + (i * slotDuration);
        const slotEnd = slotStart + slotDuration;
        
        const formatTime = (mins: number) => {
          const hours = Math.floor(mins / 60);
          const minutes = mins % 60;
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };

        const isReserved = reservations.some(r => r.slot_index === i);

        slots.push({
          id: `slot-${i}`,
          startTime: formatTime(slotStart),
          endTime: formatTime(slotEnd),
          label: `${formatTime(slotStart)} - ${formatTime(slotEnd)}`,
          available: !isReserved,
          slotIndex: i,
        });
      }
      return slots;
    }

    return [];
  }, [request, reservations]);

  const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
  const isReserveMode = request?.booking_mode === "reserve";
  const serviceFee = (request?.offered_amount || 0) * 0.1;
  const totalAmount = (request?.offered_amount || 0) + serviceFee;

  const handleNext = () => {
    if (!selectedSlot) return;
    setStep("confirm");
  };

  const handleBack = () => {
    setStep("select");
  };

  const handleSubmit = async () => {
    if (!request || !selectedSlot || !selectedSlotData) return;

    if (isReserveMode) {
      // Create a direct reservation/request
      reserveMutation.mutate(
        {
          parentRequestId: request.id,
          talentId,
          talentName: talentName || "",
          selectedSlot: selectedSlotData,
          offeredAmount: request.offered_amount,
          serviceCategory: request.service_category,
          eventTitle: request.event_title,
        },
        {
          onSuccess: () => {
            resetAndClose();
          },
        }
      );
    } else {
      // Create an application for approval
      applyMutation.mutate(
        { 
          requestId: request.id, 
          talentId, 
          message: `Selected slot: ${selectedSlotData.label}${message ? ` | Message: ${message}` : ""}` 
        },
        {
          onSuccess: () => {
            resetAndClose();
          },
        }
      );
    }
  };

  const resetAndClose = () => {
    setStep("select");
    setSelectedSlot(null);
    setMessage("");
    setAgreedToTerms(false);
    onOpenChange(false);
  };

  if (!request) return null;

  const isPending = applyMutation.isPending || reserveMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetAndClose();
      else onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isReserveMode ? "Reserve Time Slot" : "Apply for Time Slot"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" 
              ? `Select a time slot for "${request.event_title || request.service_category}"`
              : "Review and confirm your selection"
            }
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{request.service_category}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Budget per Slot</p>
                  <p className="font-medium">${request.offered_amount}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Available Time Slots
                </Label>
                
                {timeSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No time slots available
                  </p>
                ) : (
                  <RadioGroup
                    value={selectedSlot || ""}
                    onValueChange={setSelectedSlot}
                    className="grid gap-2 max-h-[250px] overflow-y-auto"
                  >
                    {timeSlots.map((slot) => (
                      <label
                        key={slot.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedSlot === slot.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <RadioGroupItem 
                          value={slot.id} 
                          id={slot.id}
                          disabled={!slot.available}
                        />
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{slot.label}</span>
                        </div>
                        {!slot.available && (
                          <span className="ml-auto text-xs text-muted-foreground">Unavailable</span>
                        )}
                      </label>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {!isReserveMode && (
                <div className="space-y-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a message to your application..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!selectedSlot}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-semibold">Booking Summary</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Request Type</span>
                    <span className="font-medium capitalize">Time-Slot {isReserveMode ? "(Reserve)" : "(Apply)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Time</span>
                    <span className="font-medium">{selectedSlotData?.label}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offer Amount</span>
                    <span>${request.offered_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee (10%)</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the terms and conditions and understand that this {isReserveMode ? "reservation" : "application"} is binding.
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={!agreedToTerms || isPending}
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Check className="w-4 h-4 mr-2" />
                {isReserveMode ? "Confirm Reservation" : "Submit Application"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
