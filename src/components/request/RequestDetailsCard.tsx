import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DollarSign, Calendar, MapPin, User, Clock, Eye, MoreHorizontal, Tag, Briefcase } from "lucide-react";
import { format } from "date-fns";
interface RequestDetailsCardProps {
  request: {
    id: string;
    service_category: string;
    service_type?: string | null;
    offered_amount: number;
    talent_name?: string | null;
    talent_category?: string | null;
    location_name?: string | null;
    city?: string | null;
    is_virtual?: boolean | null;
    venue_tbd?: boolean | null;
    start_date?: string | null;
    end_date?: string | null;
    fixed_start_time?: string | null;
    fixed_end_time?: string | null;
    event_title?: string | null;
    status: string;
    request_type: string;
    talents_needed?: number | null;
  };
  children?: React.ReactNode;
}
const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    accepted: "default",
    active: "default",
    completed: "outline",
    cancelled: "destructive",
    declined: "destructive"
  };
  return <Badge variant={variants[status] || "secondary"} className="capitalize">
      {status}
    </Badge>;
};
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};
const formatTime = (timeString: string | null | undefined) => {
  if (!timeString) return null;
  return timeString;
};
const getLocationDisplay = (request: RequestDetailsCardProps["request"]) => {
  if (request.is_virtual) return "Virtual";
  if (request.venue_tbd) return "Venue TBD";
  if (request.location_name && request.city) return `${request.location_name}, ${request.city}`;
  if (request.city) return request.city;
  if (request.location_name) return request.location_name;
  return "Location TBD";
};
export const RequestDetailsCard = ({
  request,
  children
}: RequestDetailsCardProps) => {
  const startDate = formatDate(request.start_date);
  const endDate = formatDate(request.end_date);
  const startTime = formatTime(request.fixed_start_time);
  const endTime = formatTime(request.fixed_end_time);
  const dateTimeDisplay = () => {
    const parts: string[] = [];
    if (startDate) {
      parts.push(startDate);
      if (endDate && endDate !== startDate) {
        parts[0] = `${startDate} - ${endDate}`;
      }
    }
    if (startTime && endTime) {
      parts.push(`${startTime} - ${endTime}`);
    } else if (startTime) {
      parts.push(startTime);
    }
    return parts.length > 0 ? parts.join(" | ") : "Date/Time TBD";
  };
  return <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-lg">{request.service_category}</CardTitle>
            {request.service_type && <span className="text-sm text-muted-foreground">• {request.service_type}</span>}
          </div>
          {request.event_title && <p className="text-sm text-muted-foreground my-[10px]">{request.event_title}</p>}
          {request.talent_name && <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" />
              {request.talent_name}
            </p>}
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(request.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Cancel Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm text-muted-foreground mb-4">
          {/* Service Category */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{request.service_category}</span>
          </div>

          {/* Service Type */}
          {request.service_type && <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{request.service_type}</span>
            </div>}

          {/* Budget */}
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span>${Number(request.offered_amount).toFixed(2)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{getLocationDisplay(request)}</span>
          </div>

          {/* Date/Time */}
          <div className="flex items-center gap-2 col-span-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{dateTimeDisplay()}</span>
          </div>

          {/* Talents Needed (for open/time-slot) */}
          {request.talents_needed !== undefined && request.talents_needed !== null && <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{request.talents_needed} talent(s) needed</span>
            </div>}
        </div>

        {children}
      </CardContent>
    </Card>;
};