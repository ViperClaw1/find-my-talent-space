import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, MapPin, Calendar, DollarSign, Loader2, FileText } from "lucide-react";
import { useMyApplications } from "@/hooks/useApplications";
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

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    pending: { variant: "secondary", className: "bg-amber-100 text-amber-700" },
    accepted: { variant: "default", className: "bg-green-100 text-green-700" },
    rejected: { variant: "destructive", className: "bg-red-100 text-red-700" },
  };

  const config = variants[status] || { variant: "secondary", className: "" };

  return (
    <Badge className={`capitalize ${config.className}`}>
      {status}
    </Badge>
  );
};

interface ApplicationCardProps {
  application: any;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const request = application.requests;
  
  if (!request) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">
              {request.event_title || request.service_category}
            </CardTitle>
            <CardDescription>{request.service_category}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.status)}
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
              <span>Applied {formatDate(application.created_at)}</span>
            </div>
          </div>
          
          {application.message && (
            <div className="bg-muted/50 rounded-lg p-3 mt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Your message:</span> {application.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MyApplications = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("talent");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { data: selectedTalent } = useTalent(selectedTalentId);
  const { data: openApplications = [], isLoading: loadingOpen } = useMyApplications(selectedTalentId, "open");
  const { data: timeSlotApplications = [], isLoading: loadingTimeSlot } = useMyApplications(selectedTalentId, "time-slot");

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
        <p className="text-muted-foreground">Loading applications...</p>
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
          <h1 className="text-2xl font-bold font-display">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        {!user ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Please log in to view your applications</p>
              <Button asChild>
                <a href="/auth">Login</a>
              </Button>
            </CardContent>
          </Card>
        ) : !selectedTalentId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a talent profile to view applications</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="open" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Open Requests</span>
                <Badge variant="secondary" className="ml-1">
                  {openApplications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="time-slot" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Time-Slot Requests</span>
                <Badge variant="secondary" className="ml-1">
                  {timeSlotApplications.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="space-y-4">
              {loadingOpen ? (
                renderLoading()
              ) : openApplications.length === 0 ? (
                renderEmptyState(
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No open request applications yet"
                )
              ) : (
                openApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="time-slot" className="space-y-4">
              {loadingTimeSlot ? (
                renderLoading()
              ) : timeSlotApplications.length === 0 ? (
                renderEmptyState(
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No time-slot request applications yet"
                )
              ) : (
                timeSlotApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
