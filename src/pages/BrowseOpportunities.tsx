import { useState } from "react";
import { Search, Filter, Users, Clock, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOpenRequests, useTimeSlotRequests } from "@/hooks/useApplications";
import { useTalent } from "@/hooks/useTalents";
import { ApplyDialog } from "@/components/opportunity/ApplyDialog";
import { TimeSlotApplyDialog } from "@/components/opportunity/TimeSlotApplyDialog";
import { OpenOpportunitiesTable, TimeSlotOpportunitiesTable } from "@/components/opportunity/OpportunitiesTable";

const BrowseOpportunities = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("talent");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [timeSlotDialogOpen, setTimeSlotDialogOpen] = useState(false);

  // Get selected talent's category to filter opportunities
  const { data: selectedTalent } = useTalent(selectedTalentId);

  const { data: openRequests = [], isLoading: loadingOpen } = useOpenRequests();
  const { data: timeSlotRequests = [], isLoading: loadingTimeSlot } = useTimeSlotRequests();

  const filterRequests = (requests: any[]) => {
    return requests.filter((req) => {
      const matchesSearch =
        (req.event_title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        req.service_category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || req.service_category.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  };

  const filteredOpenRequests = filterRequests(openRequests);
  const filteredTimeSlotRequests = filterRequests(timeSlotRequests);

  const handleApplyOpen = (request: any) => {
    setSelectedRequest(request);
    setApplyDialogOpen(true);
  };

  const handleApplyTimeSlot = (request: any) => {
    setSelectedRequest(request);
    setTimeSlotDialogOpen(true);
  };

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-muted-foreground mb-4 animate-spin" />
      <p className="text-muted-foreground">Loading opportunities...</p>
    </div>
  );

  const renderEmpty = (message: string) => (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <DashboardLayout
      userRole={userRole}
      onRoleChange={setUserRole}
      selectedTalentId={selectedTalentId}
      onSelectTalent={setSelectedTalentId}
    >
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">Browse Opportunities</h1>
          <p className="text-muted-foreground">Discover and apply to open requests that match your skills</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Music">Music & Entertainment</SelectItem>
              <SelectItem value="Photography">Photography</SelectItem>
              <SelectItem value="Sports">Sports & Fitness</SelectItem>
              <SelectItem value="Beauty">Beauty & Wellness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for Open and Time-Slot */}
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="open" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Open Requests</span>
              <Badge variant="secondary" className="ml-1">
                {filteredOpenRequests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="time-slot" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Time-Slot Requests</span>
              <Badge variant="secondary" className="ml-1">
                {filteredTimeSlotRequests.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            {loadingOpen ? (
              renderLoading()
            ) : filteredOpenRequests.length === 0 ? (
              renderEmpty("No open requests available")
            ) : (
              <OpenOpportunitiesTable
                requests={filteredOpenRequests}
                selectedTalentId={selectedTalentId}
                onApply={handleApplyOpen}
              />
            )}
          </TabsContent>

          <TabsContent value="time-slot">
            {loadingTimeSlot ? (
              renderLoading()
            ) : filteredTimeSlotRequests.length === 0 ? (
              renderEmpty("No time-slot requests available")
            ) : (
              <TimeSlotOpportunitiesTable
                requests={filteredTimeSlotRequests}
                selectedTalentId={selectedTalentId}
                onApply={handleApplyTimeSlot}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Apply Dialog for Open Requests */}
      <ApplyDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        request={selectedRequest}
        talentId={selectedTalentId || ""}
      />

      {/* Time Slot Apply Dialog */}
      <TimeSlotApplyDialog
        open={timeSlotDialogOpen}
        onOpenChange={setTimeSlotDialogOpen}
        request={selectedRequest}
        talentId={selectedTalentId || ""}
        talentName={selectedTalent?.name}
      />
    </DashboardLayout>
  );
};

export default BrowseOpportunities;
