import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Send, Users, Clock, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { useRequestApplications } from "@/hooks/useApplications";
import { RequestDetailsCard } from "@/components/request/RequestDetailsCard";
import { TimeSlotRequestCard } from "@/components/request/TimeSlotRequestCard";
import { ApplicationsList } from "@/components/request/ApplicationsList";

interface OpenRequestCardProps {
  request: any;
}

const OpenRequestCard = ({ request }: OpenRequestCardProps) => {
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
                  <RequestDetailsCard key={request.id} request={request} />
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
                  <OpenRequestCard key={request.id} request={request} />
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
                  <TimeSlotRequestCard key={request.id} request={request} />
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
