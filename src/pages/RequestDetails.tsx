import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  User,
  Users,
  Tag,
  Briefcase,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useTimeSlotReservations } from "@/hooks/useTimeSlotReservations";

/* =======================
   Types
======================= */

type Tier = {
  slots: number | string;
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    accepted: "default",
    active: "default",
    completed: "outline",
    cancelled: "destructive",
    declined: "destructive",
  };

  return (
    <Badge variant={variants[status] || "secondary"} className="capitalize">
      {status}
    </Badge>
  );
};

const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [userRole, setUserRole] = useState<"client" | "talent">("client");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  const { data: request, isLoading } = useQuery({
    queryKey: ["request-details", requestId],
    queryFn: async () => {
      if (!requestId) return null;

      const { data, error } = await supabase.from("requests").select("*").eq("id", requestId).maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!requestId,
  });

  const { data: reservations = [] } = useTimeSlotReservations(requestId || null);

  const getLocationDisplay = () => {
    if (!request) return "Location TBD";
    if (request.is_virtual) return "Virtual Event";
    if (request.venue_tbd) return "Venue TBD";
    if (request.location_name && request.city) return `${request.location_name}, ${request.city}`;
    if (request.city) return request.city;
    if (request.location_name) return request.location_name;
    return "Location TBD";
  };

  /* =======================
     Slot Stats (FIXED)
  ======================= */

  const getSlotStats = () => {
    if (!request || request.request_type !== "time-slot") return null;

    let totalSlots = 0;

    if (request.time_type === "tier" && request.tiers) {
      const tiersArray: Tier[] = Array.isArray(request.tiers)
        ? (request.tiers as Tier[])
        : Object.values(request.tiers as Record<string, Tier>);

      totalSlots = tiersArray.reduce((sum, tier) => {
        const slots = Number(tier?.slots || 0);
        return sum + slots;
      }, 0);
    } else if (request.fixed_slots) {
      totalSlots = Number(request.fixed_slots) || 0;
    }

    const reservedSlots = reservations.length;
    const availableSlots = Math.max(0, totalSlots - reservedSlots);

    return { totalSlots, availableSlots, reservedSlots };
  };

  const slotStats = getSlotStats();

  /* =======================
     Loading / Not found
  ======================= */

  if (isLoading) {
    return (
      <DashboardLayout
        userRole={userRole}
        onRoleChange={setUserRole}
        selectedTalentId={selectedTalentId}
        onSelectTalent={setSelectedTalentId}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading request details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout
        userRole={userRole}
        onRoleChange={setUserRole}
        selectedTalentId={selectedTalentId}
        onSelectTalent={setSelectedTalentId}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Request not found</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================
     Render
  ======================= */

  return (
    <DashboardLayout
      userRole={userRole}
      onRoleChange={setUserRole}
      selectedTalentId={selectedTalentId}
      onSelectTalent={setSelectedTalentId}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{request.service_category}</h1>
              {request.service_type && <p className="text-muted-foreground">{request.service_type}</p>}
              {request.event_title && <p className="text-sm text-muted-foreground mt-1">{request.event_title}</p>}
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(request.status)}
              <Badge variant="outline" className="capitalize">
                {request.request_type}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{request.service_category}</p>
                </div>
              </div>

              {request.service_type && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{request.service_type}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium text-lg">${Number(request.offered_amount).toFixed(2)}</p>
                </div>
              </div>

              {request.request_type === "open" && request.talents_needed && (
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Talents Needed</p>
                    <p className="font-medium">{request.talents_needed}</p>
                  </div>
                </div>
              )}

              {slotStats && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Slots Available</p>
                    <p className="font-medium">
                      {slotStats.availableSlots} / {slotStats.totalSlots}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                Location & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {request.is_virtual ? (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{getLocationDisplay()}</p>
                  {request.address && <p className="text-sm text-muted-foreground">{request.address}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(request.start_date)}
                    {request.end_date && request.end_date !== request.start_date && (
                      <> - {formatDate(request.end_date)}</>
                    )}
                  </p>
                </div>
              </div>

              {(request.fixed_start_time || request.fixed_end_time) && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {request.fixed_start_time}
                      {request.fixed_end_time && <> - {request.fixed_end_time}</>}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time Slot Details */}
          {request.request_type === "time-slot" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Mode</p>
                    <p className="font-medium capitalize">
                      {request.booking_mode === "reserve" ? "Reserve (Instant)" : "Apply (Requires Approval)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time Type</p>
                    <p className="font-medium capitalize">
                      {request.time_type === "tier" ? "Custom Tiers" : "Fixed Slots"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Visibility</p>
                    <p className="font-medium capitalize">{request.visibility || "Public"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestDetails;
