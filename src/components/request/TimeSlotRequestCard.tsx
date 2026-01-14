import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RequestDetailsCard } from "./RequestDetailsCard";
import { ApplicationsList } from "./ApplicationsList";
import { useRequestApplications } from "@/hooks/useApplications";

interface TimeSlotRequestCardProps {
  request: any;
}

export const TimeSlotRequestCard = ({ request }: TimeSlotRequestCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: applications = [] } = useRequestApplications(request.id);
  const pendingCount = applications.filter(a => a.status === "pending").length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <RequestDetailsCard request={request}>
        <div className="flex items-center gap-2 mb-4">
          {pendingCount > 0 && (
            <Badge variant="default" className="bg-primary">
              {pendingCount} pending application(s)
            </Badge>
          )}
          <Badge variant="outline" className="capitalize">
            {request.booking_mode === "reserve" ? "Instant Reserve" : "Requires Approval"}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {request.time_type === "tier" ? "Custom Tiers" : "Fixed Slots"}
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
          />
        </CollapsibleContent>
      </RequestDetailsCard>
    </Collapsible>
  );
};
