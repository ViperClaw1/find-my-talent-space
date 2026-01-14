import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventGroup {
  eventTitle: string;
  requests: any[];
  startDate: string | null;
  city: string | null;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Flexible";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-muted text-muted-foreground",
  };

  return (
    <Badge className={`capitalize ${variants[status] || ""}`}>
      {status}
    </Badge>
  );
};

interface EventCardProps {
  event: EventGroup;
}

const EventCard = ({ event }: EventCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-display">
                  {event.eventTitle || "Untitled Event"}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  {event.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate)}
                  </span>
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {event.requests.length} request{event.requests.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mt-2">
                {isOpen ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Requests
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    View Requests ({event.requests.length})
                  </>
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-3">
              {event.requests.map((request) => (
                <div 
                  key={request.id} 
                  className="p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{request.service_category}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="capitalize">{request.request_type}</span>
                    </div>
                    <div>
                      Budget: ${Number(request.offered_amount).toFixed(0)}
                    </div>
                    {request.talent_name && (
                      <div className="col-span-2">
                        Talent: {request.talent_name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
};

const MyEvents = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("client");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { data: allRequests = [], isLoading } = useRequests();

  // Group requests by event_title
  const eventGroups: EventGroup[] = allRequests.reduce((acc: EventGroup[], request) => {
    const eventTitle = request.event_title || "Other Requests";
    const existingGroup = acc.find(g => g.eventTitle === eventTitle);
    
    if (existingGroup) {
      existingGroup.requests.push(request);
    } else {
      acc.push({
        eventTitle,
        requests: [request],
        startDate: request.start_date,
        city: request.city,
      });
    }
    return acc;
  }, []);

  // Sort by date
  eventGroups.sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <DashboardLayout 
      userRole={userRole} 
      onRoleChange={setUserRole}
      selectedTalentId={selectedTalentId}
      onSelectTalent={setSelectedTalentId}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display">My Events</h1>
            <p className="text-muted-foreground">View all your events and their related requests</p>
          </div>
          <Button asChild>
            <Link to="/dashboard/create-request">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        {!user ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Please log in to view your events</p>
              <Button asChild>
                <a href="/auth">Login</a>
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-muted-foreground mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading events...</p>
            </CardContent>
          </Card>
        ) : eventGroups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No events yet</p>
              <Button asChild>
                <Link to="/dashboard/create-request">Create your first request</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {eventGroups.map((event, index) => (
              <EventCard key={`${event.eventTitle}-${index}`} event={event} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyEvents;