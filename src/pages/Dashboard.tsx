import { useState } from "react";
import { Send, Clock, Users, DollarSign, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RequestCard from "@/components/dashboard/RequestCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockRequests = [
  {
    id: "1",
    type: "direct" as const,
    title: "DJ for Corporate Event",
    category: "Music & Entertainment - DJ",
    location: "New York",
    isVirtual: false,
    date: "Jan 15, 2026",
    budget: 1500,
    status: "active" as const,
  },
  {
    id: "2",
    type: "open" as const,
    title: "Photographers Needed",
    category: "Photography & Videography",
    location: "Los Angeles",
    isVirtual: false,
    date: "Jan 20, 2026",
    budget: 2000,
    status: "pending" as const,
    talentsNeeded: 3,
    talentsApplied: 5,
  },
  {
    id: "3",
    type: "time-slot" as const,
    title: "Yoga Sessions - Spring Festival",
    category: "Sports & Fitness - Yoga",
    location: "Miami",
    isVirtual: false,
    date: "Feb 1, 2026",
    budget: 500,
    status: "active" as const,
  },
];

const Dashboard = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("client");
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);

  return (
    <DashboardLayout 
      userRole={userRole} 
      onRoleChange={setUserRole}
      selectedTalentId={selectedTalentId}
      onSelectTalent={setSelectedTalentId}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground">
              {userRole === "client"
                ? "Manage your requests and find the perfect talent."
                : "Browse opportunities and grow your career."}
            </p>
          </div>
          {userRole === "client" && (
            <Link to="/dashboard/create-request">
              <Button variant="hero" size="lg">
                Create Request
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userRole === "client" ? (
            <>
              <StatsCard
                title="Active Requests"
                value={12}
                change="+2 this week"
                changeType="positive"
                icon={Send}
                delay={0}
              />
              <StatsCard
                title="Pending Approval"
                value={5}
                icon={Clock}
                delay={0.1}
              />
              <StatsCard
                title="Talents Hired"
                value={48}
                change="+8 this month"
                changeType="positive"
                icon={Users}
                delay={0.2}
              />
              <StatsCard
                title="Total Spent"
                value="$24,500"
                change="+15%"
                changeType="positive"
                icon={DollarSign}
                delay={0.3}
              />
            </>
          ) : (
            <>
              <StatsCard
                title="Active Bookings"
                value={8}
                icon={Clock}
                delay={0}
              />
              <StatsCard
                title="Applications"
                value={15}
                change="+3 pending"
                changeType="neutral"
                icon={Send}
                delay={0.1}
              />
              <StatsCard
                title="Total Earned"
                value="$18,200"
                change="+12%"
                changeType="positive"
                icon={DollarSign}
                delay={0.2}
              />
              <StatsCard
                title="Profile Views"
                value={324}
                change="+28%"
                changeType="positive"
                icon={TrendingUp}
                delay={0.3}
              />
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-display">
              {userRole === "client" ? "Recent Requests" : "Recent Bookings"}
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRequests.map((request, index) => (
              <RequestCard
                key={request.id}
                {...request}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
