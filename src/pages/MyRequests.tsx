import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Users, Clock, Eye, MoreHorizontal, Calendar, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demonstration
const mockDirectRequests = [
  {
    id: "1",
    talentName: "Sarah Johnson",
    serviceCategory: "Photography",
    offerAmount: 500,
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    talentName: "Mike Chen",
    serviceCategory: "Videography",
    offerAmount: 800,
    status: "accepted",
    createdAt: "2024-01-14",
  },
];

const mockOpenRequests = [
  {
    id: "3",
    title: "Wedding Photography Needed",
    serviceCategory: "Photography",
    budget: 1500,
    applicants: 5,
    status: "active",
    createdAt: "2024-01-13",
  },
];

const mockTimeSlotRequests = [
  {
    id: "4",
    eventTitle: "Corporate Event 2024",
    serviceCategory: "DJ",
    budget: 2000,
    slotsBooked: 3,
    totalSlots: 8,
    status: "active",
    eventDate: "2024-02-20",
  },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    accepted: "default",
    active: "default",
    completed: "outline",
    cancelled: "destructive",
  };

  return (
    <Badge variant={variants[status] || "secondary"} className="capitalize">
      {status}
    </Badge>
  );
};

const MyRequests = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("client");

  return (
    <DashboardLayout userRole={userRole} onRoleChange={setUserRole}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display">My Requests</h1>
          <p className="text-muted-foreground">Manage and track all your requests</p>
        </div>

        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Direct</span>
              <Badge variant="secondary" className="ml-1 hidden sm:flex">
                {mockDirectRequests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="open" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Open</span>
              <Badge variant="secondary" className="ml-1 hidden sm:flex">
                {mockOpenRequests.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="time-slot" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Time-Slot</span>
              <Badge variant="secondary" className="ml-1 hidden sm:flex">
                {mockTimeSlotRequests.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Direct Requests Tab */}
          <TabsContent value="direct" className="space-y-4">
            {mockDirectRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Send className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No direct requests yet</p>
                </CardContent>
              </Card>
            ) : (
              mockDirectRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{request.talentName}</CardTitle>
                      <CardDescription>{request.serviceCategory}</CardDescription>
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
                        ${request.offerAmount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {request.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Open Requests Tab */}
          <TabsContent value="open" className="space-y-4">
            {mockOpenRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No open requests yet</p>
                </CardContent>
              </Card>
            ) : (
              mockOpenRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription>{request.serviceCategory}</CardDescription>
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
                            View Applicants ({request.applicants})
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
                        Budget: ${request.budget}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {request.applicants} applicants
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {request.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Time-Slot Requests Tab */}
          <TabsContent value="time-slot" className="space-y-4">
            {mockTimeSlotRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No time-slot requests yet</p>
                </CardContent>
              </Card>
            ) : (
              mockTimeSlotRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{request.eventTitle}</CardTitle>
                      <CardDescription>{request.serviceCategory}</CardDescription>
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
                        Budget: ${request.budget}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {request.slotsBooked}/{request.totalSlots} slots booked
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {request.eventDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MyRequests;
