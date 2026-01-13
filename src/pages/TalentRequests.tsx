import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Users, Clock, MapPin, Calendar, DollarSign, Loader2, CheckCircle, FileText } from "lucide-react";
import { useMyConfirmedRequests } from "@/hooks/useApplications";
import { useTalent } from "@/hooks/useTalents";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Flexible";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

interface ConfirmedRequestCardProps {
  application: any;
}

const ConfirmedRequestCard = ({ application }: ConfirmedRequestCardProps) => {
  const request = application.requests;
  
  if (!request) return null;

  const getTypeBadge = () => {
    const typeConfig: Record<string, { className: string; label: string }> = {
      direct: { className: "bg-blue-100 text-blue-700", label: "Direct" },
      open: { className: "bg-amber-100 text-amber-700", label: "Open" },
      "time-slot": { className: "bg-purple-100 text-purple-700", label: "Time Slot" },
    };
    
    const config = typeConfig[request.request_type] || typeConfig.open;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {request.event_title || request.service_category}
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardTitle>
            <CardDescription>{request.service_category}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getTypeBadge()}
            <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>${Number(request.offered_amount).toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{request.city || "Location TBD"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(request.start_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Accepted {formatDate(application.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TalentRequests = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("talent");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { data: selectedTalent } = useTalent(selectedTalentId);
  const { data: confirmedRequests = [], isLoading } = useMyConfirmedRequests(selectedTalentId);

  // Separate by request type
  const directRequests = confirmedRequests.filter(app => app.requests?.request_type === "direct");
  const openRequests = confirmedRequests.filter(app => app.requests?.request_type === "open");
  const timeSlotRequests = confirmedRequests.filter(app => app.requests?.request_type === "time-slot");

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
          <p className="text-muted-foreground">
            View all your confirmed and active requests
          </p>
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
        ) : !selectedTalentId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a talent profile to view your requests</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">All</span>
                <Badge variant="secondary" className="ml-1">
                  {confirmedRequests.length}
                </Badge>
              </TabsTrigger>
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

            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                renderLoading()
              ) : confirmedRequests.length === 0 ? (
                renderEmptyState(
                  <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No confirmed requests yet"
                )
              ) : (
                confirmedRequests.map((application) => (
                  <ConfirmedRequestCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="direct" className="space-y-4">
              {isLoading ? (
                renderLoading()
              ) : directRequests.length === 0 ? (
                renderEmptyState(
                  <Send className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No direct requests yet"
                )
              ) : (
                directRequests.map((application) => (
                  <ConfirmedRequestCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              {isLoading ? (
                renderLoading()
              ) : openRequests.length === 0 ? (
                renderEmptyState(
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No open requests yet"
                )
              ) : (
                openRequests.map((application) => (
                  <ConfirmedRequestCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="time-slot" className="space-y-4">
              {isLoading ? (
                renderLoading()
              ) : timeSlotRequests.length === 0 ? (
                renderEmptyState(
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No time-slot requests yet"
                )
              ) : (
                timeSlotRequests.map((application) => (
                  <ConfirmedRequestCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TalentRequests;
