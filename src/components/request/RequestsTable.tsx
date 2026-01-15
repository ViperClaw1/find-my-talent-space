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
import { MapPin, Calendar, DollarSign, Eye, ChevronDown, ChevronUp, Users, Clock } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useRequestApplications } from "@/hooks/useApplications";
import { ApplicationsList } from "@/components/request/ApplicationsList";
import { useTimeSlotReservations } from "@/hooks/useTimeSlotReservations";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Flexible";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

const formatTime = (timeString: string | null) => {
  if (!timeString) return "";
  return timeString;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge className={`capitalize ${variants[status] || ""}`}>
      {status}
    </Badge>
  );
};

interface DirectRequestsTableProps {
  requests: any[];
}

export const DirectRequestsTable = ({ requests }: DirectRequestsTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Talent</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <div>
                  <p className="font-medium">{request.service_category}</p>
                  {request.service_type && (
                    <p className="text-sm text-muted-foreground">{request.service_type}</p>
                  )}
                  {request.event_title && (
                    <p className="text-xs text-muted-foreground">{request.event_title}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{request.talent_name || "—"}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{request.is_virtual ? "Virtual" : request.city || "TBD"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(request.start_date)}</span>
                  </div>
                  {request.fixed_start_time && (
                    <p className="text-xs text-muted-foreground">
                      {formatTime(request.fixed_start_time)} - {formatTime(request.fixed_end_time)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 font-medium">
                  <DollarSign className="w-3 h-3" />
                  {Number(request.offered_amount).toFixed(0)}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/dashboard/request/${request.id}`)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface OpenRequestRowProps {
  request: any;
}

const OpenRequestRow = ({ request }: OpenRequestRowProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: applications = [] } = useRequestApplications(request.id);
  const pendingCount = applications.filter(a => a.status === "pending").length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell>
          <div>
            <p className="font-medium">{request.service_category}</p>
            {request.service_type && (
              <p className="text-sm text-muted-foreground">{request.service_type}</p>
            )}
            {request.event_title && (
              <p className="text-xs text-muted-foreground">{request.event_title}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{request.talents_needed || 1} needed</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{request.is_virtual ? "Virtual" : request.city || "TBD"}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(request.start_date)}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 font-medium">
            <DollarSign className="w-3 h-3" />
            {Number(request.offered_amount).toFixed(0)}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {getStatusBadge(request.status)}
            {pendingCount > 0 && (
              <Badge variant="default" className="bg-primary text-xs">
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard/request/${request.id}`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </TableCell>
      </TableRow>
      <CollapsibleContent asChild>
        <tr>
          <td colSpan={7} className="p-0">
            <div className="p-4 bg-muted/30 border-t">
              <ApplicationsList 
                requestId={request.id} 
                offeredAmount={Number(request.offered_amount)} 
              />
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface OpenRequestsTableProps {
  requests: any[];
}

export const OpenRequestsTable = ({ requests }: OpenRequestsTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Talents</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <OpenRequestRow key={request.id} request={request} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface TimeSlotRequestRowProps {
  request: any;
}

const calculateSlotStats = (request: any, reservations: any[]) => {
  const confirmedReservations = reservations.filter(r => r.status === "confirmed" || r.status === "accepted");
  
  if (request.time_type === "tier" && request.tiers) {
    const tiers = Array.isArray(request.tiers) ? request.tiers : [];
    const totalSlots = tiers.reduce((sum: number, tier: any) => sum + (tier.slots || 0), 0);
    const usedSlots = confirmedReservations.length;
    return { available: totalSlots - usedSlots, total: totalSlots };
  } else if (request.fixed_slots) {
    const usedSlots = confirmedReservations.length;
    return { available: request.fixed_slots - usedSlots, total: request.fixed_slots };
  }
  return { available: 0, total: 0 };
};

const TimeSlotRequestRow = ({ request }: TimeSlotRequestRowProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: reservations = [] } = useTimeSlotReservations(request.id);
  const { data: applications = [] } = useRequestApplications(request.id);
  const pendingCount = applications.filter(a => a.status === "pending").length;
  const slotStats = calculateSlotStats(request, reservations);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell>
          <div>
            <p className="font-medium">{request.service_category}</p>
            {request.service_type && (
              <p className="text-sm text-muted-foreground">{request.service_type}</p>
            )}
            {request.event_title && (
              <p className="text-xs text-muted-foreground">{request.event_title}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="font-medium">{slotStats.available}/{slotStats.total}</span>
            <span className="text-muted-foreground">slots</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{request.is_virtual ? "Virtual" : request.city || "TBD"}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(request.start_date)}</span>
            </div>
            {request.fixed_start_time && (
              <p className="text-xs text-muted-foreground">
                {formatTime(request.fixed_start_time)} - {formatTime(request.fixed_end_time)}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 font-medium">
            <DollarSign className="w-3 h-3" />
            {Number(request.offered_amount).toFixed(0)}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {getStatusBadge(request.status)}
            {pendingCount > 0 && (
              <Badge variant="default" className="bg-primary text-xs">
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard/request/${request.id}`)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </TableCell>
      </TableRow>
      <CollapsibleContent asChild>
        <tr>
          <td colSpan={7} className="p-0">
            <div className="p-4 bg-muted/30 border-t">
              <ApplicationsList 
                requestId={request.id} 
                offeredAmount={Number(request.offered_amount)}
                requestType="time-slot"
              />
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface TimeSlotRequestsTableProps {
  requests: any[];
}

export const TimeSlotRequestsTable = ({ requests }: TimeSlotRequestsTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Slots</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TimeSlotRequestRow key={request.id} request={request} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
