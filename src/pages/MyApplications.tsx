import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Loader2, FileText } from "lucide-react";
import { useMyApplications } from "@/hooks/useApplications";
import { useTalent } from "@/hooks/useTalents";
import { useAuth } from "@/hooks/useAuth";
import { PayToConfirmDialog } from "@/components/application/PayToConfirmDialog";
import { ApplicationsTable } from "@/components/application/ApplicationsTable";

// Extract tier_id and slot_index from message
const extractSlotInfo = (message: string | null) => {
  if (!message) return { tierId: null, slotIndex: null, selectedSlot: null };
  
  // Try to extract slot info from message like "Selected slot: 09:00 - 10:00"
  const slotMatch = message.match(/Selected slot: (.+?)(?:\||$)/);
  const selectedSlot = slotMatch ? slotMatch[1].trim() : null;
  
  // For slot-index based: "slot-0", "slot-1", etc.
  const slotIndexMatch = message.match(/slot-(\d+)/i);
  const slotIndex = slotIndexMatch ? parseInt(slotIndexMatch[1]) : null;
  
  // For tier-based: look for tier id pattern
  const tierMatch = message.match(/tier[_-]?(\w+)/i);
  const tierId = tierMatch ? tierMatch[0] : null;
  
  return { tierId, slotIndex, selectedSlot };
};

const MyApplications = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("talent");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const { user } = useAuth();
  
  const { data: selectedTalent } = useTalent(selectedTalentId);
  const { data: openApplications = [], isLoading: loadingOpen } = useMyApplications(selectedTalentId, "open");
  const { data: timeSlotApplications = [], isLoading: loadingTimeSlot } = useMyApplications(selectedTalentId, "time-slot");

  const handlePayToConfirm = (application: any) => {
    setSelectedApplication(application);
    setPayDialogOpen(true);
  };

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

  const slotInfo = selectedApplication ? extractSlotInfo(selectedApplication.message) : null;

  return (
    <DashboardLayout 
      userRole={userRole} 
      onRoleChange={setUserRole}
      selectedTalentId={selectedTalentId}
      onSelectTalent={setSelectedTalentId}
    >
      <div className="max-w-6xl mx-auto">
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

            <TabsContent value="open">
              {loadingOpen ? (
                renderLoading()
              ) : openApplications.length === 0 ? (
                renderEmptyState(
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No open request applications yet"
                )
              ) : (
                <ApplicationsTable 
                  applications={openApplications}
                  onPayToConfirm={handlePayToConfirm}
                />
              )}
            </TabsContent>

            <TabsContent value="time-slot">
              {loadingTimeSlot ? (
                renderLoading()
              ) : timeSlotApplications.length === 0 ? (
                renderEmptyState(
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />,
                  "No time-slot request applications yet"
                )
              ) : (
                <ApplicationsTable 
                  applications={timeSlotApplications}
                  onPayToConfirm={handlePayToConfirm}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {selectedApplication && (
        <PayToConfirmDialog
          open={payDialogOpen}
          onOpenChange={setPayDialogOpen}
          applicationId={selectedApplication.id}
          requestId={selectedApplication.request_id}
          serviceCategory={selectedApplication.requests?.service_category || ""}
          eventTitle={selectedApplication.requests?.event_title}
          offeredAmount={Number(selectedApplication.requests?.offered_amount || 0)}
          selectedSlot={slotInfo?.selectedSlot || undefined}
          isTimeSlot={selectedApplication.requests?.request_type === "time-slot"}
          tierId={slotInfo?.tierId}
          slotIndex={slotInfo?.slotIndex}
        />
      )}
    </DashboardLayout>
  );
};

export default MyApplications;
