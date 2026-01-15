import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Calendar, DollarSign, Users, Clock, Eye } from "lucide-react";
import { useHasApplied } from "@/hooks/useApplications";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Flexible";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

interface OpenOpportunitiesTableProps {
  requests: any[];
  selectedTalentId: string | null;
  onApply: (request: any) => void;
}

const OpenOpportunityRow = ({
  request,
  selectedTalentId,
  onApply,
}: {
  request: any;
  selectedTalentId: string | null;
  onApply: () => void;
}) => {
  const navigate = useNavigate();
  const { data: hasApplied = false } = useHasApplied(request.id, selectedTalentId);

  const handleClick = () => {
    if (hasApplied) {
      navigate("/dashboard/applications");
    } else {
      onApply();
    }
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <div>
          <p className="font-medium">{request.service_category}</p>
          {request.service_type && (
            <p className="text-sm text-muted-foreground">{request.service_type}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {request.event_title || "—"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{request.is_virtual ? "Virtual" : request.city || "TBD"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(request.start_date)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{request.talents_needed || 1}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="w-3 h-3" />
          {Number(request.offered_amount).toFixed(0)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/request/${request.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={!selectedTalentId}
            variant={hasApplied ? "outline" : "default"}
          >
            {!selectedTalentId ? "Select profile" : hasApplied ? "Applied" : "Apply"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const OpenOpportunitiesTable = ({
  requests,
  selectedTalentId,
  onApply,
}: OpenOpportunitiesTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Talents</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <OpenOpportunityRow
              key={request.id}
              request={request}
              selectedTalentId={selectedTalentId}
              onApply={() => onApply(request)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface TimeSlotOpportunitiesTableProps {
  requests: any[];
  selectedTalentId: string | null;
  onApply: (request: any) => void;
}

const TimeSlotOpportunityRow = ({
  request,
  selectedTalentId,
  onApply,
}: {
  request: any;
  selectedTalentId: string | null;
  onApply: () => void;
}) => {
  const navigate = useNavigate();
  const { data: hasApplied = false } = useHasApplied(request.id, selectedTalentId);
  const isReserveMode = request.booking_mode === "reserve";

  const getButtonText = () => {
    if (!selectedTalentId) return "Select profile";
    if (hasApplied) return "Applied";
    return isReserveMode ? "Reserve" : "Apply";
  };

  const handleClick = () => {
    if (hasApplied) {
      navigate("/dashboard/applications");
    } else {
      onApply();
    }
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <div>
          <p className="font-medium">{request.service_category}</p>
          {request.service_type && (
            <p className="text-sm text-muted-foreground">{request.service_type}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {request.event_title || "—"}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {isReserveMode ? "Reserve" : "Apply"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{request.is_virtual ? "Virtual" : request.city || "TBD"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(request.start_date)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{request.time_type === "tier" ? "Tiers" : `${request.fixed_slots || 0} slots`}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="w-3 h-3" />
          {Number(request.offered_amount).toFixed(0)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/request/${request.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={!selectedTalentId}
            variant={hasApplied ? "outline" : isReserveMode ? "default" : "default"}
          >
            {getButtonText()}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const TimeSlotOpportunitiesTable = ({
  requests,
  selectedTalentId,
  onApply,
}: TimeSlotOpportunitiesTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Booking</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Slots</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TimeSlotOpportunityRow
              key={request.id}
              request={request}
              selectedTalentId={selectedTalentId}
              onApply={() => onApply(request)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
