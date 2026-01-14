import { useState, useMemo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { RequestDetailsCard } from "./RequestDetailsCard";
import { ApplicationsList } from "./ApplicationsList";
import { useRequestApplications } from "@/hooks/useApplications";
import { useTimeSlotReservations } from "@/hooks/useTimeSlotReservations";

interface TimeSlotRequestCardProps {
  request: any;
}

// Calculate total slots and reserved slots
const calculateSlotStats = (request: any, reservations: any[]) => {
  let totalSlots = 0;
  let reservedSlots = reservations.length;

  if (request.time_type === "tier" && request.tiers) {
    const tiers = Array.isArray(request.tiers) ? request.tiers : [];
    totalSlots = tiers.reduce((sum: number, tier: any) => sum + (parseInt(tier.slots) || 0), 0);
  } else if (request.fixed_slots) {
    totalSlots = parseInt(request.fixed_slots) || 0;
  }

  const availableSlots = Math.max(0, totalSlots - reservedSlots);
  return { totalSlots, availableSlots, reservedSlots };
};

export const TimeSlotRequestCard = ({ request }: TimeSlotRequestCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: applications = [] } = useRequestApplications(request.id);
  const { data: reservations = [] } = useTimeSlotReservations(request.id);
  const pendingCount = applications.filter(a => a.status === "pending").length;

  const slotStats = useMemo(() => calculateSlotStats(request, reservations), [request, reservations]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <RequestDetailsCard request={request}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {pendingCount > 0 && (
            <Badge variant="default" className="bg-primary">
              {pendingCount} pending application(s)
            </Badge>
          )}
          <Badge variant="outline" className="capitalize">
            {request.booking_mode === "reserve" ? "Reserve Booking" : "Apply Booking"}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {request.time_type === "tier" ? "Custom Tiers" : "Fixed Slots"}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {slotStats.availableSlots}/{slotStats.totalSlots} slots available
          </Badge>
        </div>

        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            {isOpen ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Hide Applications
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                View Applications ({applications.length})
              </>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <ApplicationsList 
            requestId={request.id} 
            offeredAmount={Number(request.offered_amount)}
            requestType="time-slot"
          />
        </CollapsibleContent>
      </RequestDetailsCard>
    </Collapsible>
  );
};
