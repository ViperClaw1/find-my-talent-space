import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Users, Clock, Eye, MoreHorizontal, Calendar, DollarSign, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

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

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

const MyRequests = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("client");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { data: directRequests = [], isLoading: loadingDirect } = useRequests("direct");
  const { data: openRequests = [], isLoading: loadingOpen } = useRequests("open");
  const { data: timeSlotRequests = [], isLoading: loadingTimeSlot } = useRequests("time-slot");

  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {icon}
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );

  const renderLoading = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-muted-foreground mb-4 animate-spin" />
        <p className="text-muted-foreground">Loading requests...</p>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout 
      userRole={userRole} 
      onRoleChange={setUserRole}
      selectedTalentId={selectedTalentId}
      onSelectTalent={setSelectedTalentId}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display">My Requests</h1>
          <p className="text-muted-foreground">Manage and track all your requests</p>
        </div>

        {!user ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Please log in to view your requests</p>
              <Button asChild>
                <a href="/auth">Login</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="direct" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Direct</span>
                <Badge variant="secondary" className="ml-1 hidden sm:flex">
                  {directRequests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Open</span>
                <Badge variant="secondary" className="ml-1 hidden sm:flex">
                  {openRequests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="time-slot" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Time-Slot</span>
                <Badge variant="secondary" className="ml-1 hidden sm:flex">
                  {timeSlotRequests.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Direct Requests Tab */}
            <TabsContent value="direct" className="space-y-4">
              {loadingDirect ? (
                renderLoading()
              ) : directRequests.length === 0 ? (
                renderEmptyState(
                  <Send className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No direct requests yet"
                )
              ) : (
                directRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">{request.talent_name || "Unknown Talent"}</CardTitle>
                        <CardDescription>{request.service_category}</CardDescription>
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${Number(request.offered_amount).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(request.created_at)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Open Requests Tab */}
            <TabsContent value="open" className="space-y-4">
              {loadingOpen ? (
                renderLoading()
              ) : openRequests.length === 0 ? (
                renderEmptyState(
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No open requests yet"
                )
              ) : (
                openRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">{request.event_title || request.service_category}</CardTitle>
                        <CardDescription>{request.service_category}</CardDescription>
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
                            <DropdownMenuItem>
                              View Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel Request
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Budget: ${Number(request.offered_amount).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {request.talents_needed} talents needed
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(request.created_at)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Time-Slot Requests Tab */}
            <TabsContent value="time-slot" className="space-y-4">
              {loadingTimeSlot ? (
                renderLoading()
              ) : timeSlotRequests.length === 0 ? (
                renderEmptyState(
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No time-slot requests yet"
                )
              ) : (
                timeSlotRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">{request.event_title || "Untitled Event"}</CardTitle>
                        <CardDescription>{request.service_category}</CardDescription>
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
                            <DropdownMenuItem>
                              Manage Time Slots
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Budget: ${Number(request.offered_amount).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.fixed_slots || 0} slots
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(request.start_date)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyRequests;
