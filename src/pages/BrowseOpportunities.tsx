import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Calendar, DollarSign, Users, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  type: "open" | "time-slot";
  title: string;
  category: string;
  location: string;
  isVirtual: boolean;
  date: string;
  budget: number;
  talentsNeeded: number;
  talentsApplied: number;
  description: string;
  requirements: string[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    type: "open",
    title: "DJ for Summer Music Festival",
    category: "Music & Entertainment",
    location: "Miami Beach, FL",
    isVirtual: false,
    date: "Feb 15, 2026",
    budget: 2500,
    talentsNeeded: 3,
    talentsApplied: 8,
    description: "Looking for experienced DJs to perform at our annual summer music festival. Multiple stages with different genres.",
    requirements: ["5+ years experience", "Own equipment", "Festival experience preferred"],
  },
  {
    id: "2",
    type: "time-slot",
    title: "Corporate Photography Session",
    category: "Photography & Videography",
    location: "New York, NY",
    isVirtual: false,
    date: "Jan 25, 2026",
    budget: 1500,
    talentsNeeded: 2,
    talentsApplied: 4,
    description: "Professional headshots and team photos for a tech company. Modern, clean style required.",
    requirements: ["Professional portfolio", "Studio lighting experience", "Quick turnaround"],
  },
  {
    id: "3",
    type: "open",
    title: "Virtual Yoga Instructors",
    category: "Sports & Fitness",
    location: "Virtual",
    isVirtual: true,
    date: "Ongoing",
    budget: 800,
    talentsNeeded: 5,
    talentsApplied: 12,
    description: "Seeking certified yoga instructors for our wellness app. Various styles including Vinyasa, Hatha, and Yin.",
    requirements: ["Yoga certification", "High-quality camera setup", "Engaging teaching style"],
  },
  {
    id: "4",
    type: "time-slot",
    title: "Wedding Makeup Artists",
    category: "Beauty & Wellness",
    location: "Los Angeles, CA",
    isVirtual: false,
    date: "Mar 20, 2026",
    budget: 600,
    talentsNeeded: 2,
    talentsApplied: 6,
    description: "Looking for talented makeup artists for a spring wedding. Bridal and bridal party makeup needed.",
    requirements: ["Bridal experience", "Own kit", "References required"],
  },
];

const BrowseOpportunities = () => {
  const [userRole, setUserRole] = useState<"client" | "talent">("talent");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || opp.category.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const handleApply = (opportunity: Opportunity) => {
    toast.success("Application submitted!", {
      description: `Your application for "${opportunity.title}" has been sent.`,
    });
    setSelectedOpportunity(null);
  };

  return (
    <DashboardLayout userRole={userRole} onRoleChange={setUserRole}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Browse Opportunities
          </h1>
          <p className="text-muted-foreground">
            Discover and apply to open requests that match your skills
          </p>
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

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge
                  className={
                    opportunity.type === "open"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-purple-100 text-purple-700"
                  }
                >
                  {opportunity.type === "open" ? "Open Request" : "Time Slot"}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-bold text-lg">${opportunity.budget}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {opportunity.category}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{opportunity.isVirtual ? "Virtual" : opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{opportunity.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {opportunity.talentsApplied}/{opportunity.talentsNeeded} applied
                  </span>
                </div>
                {opportunity.type === "time-slot" && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Multiple slots</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {opportunity.description}
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedOpportunity(opportunity)}
                  >
                    View Details & Apply
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-card">
                  <DialogHeader>
                    <DialogTitle className="font-display">{opportunity.title}</DialogTitle>
                    <DialogDescription>{opportunity.category}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">
                          {opportunity.isVirtual ? "Virtual" : opportunity.location}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{opportunity.date}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">${opportunity.budget}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Spots</p>
                        <p className="font-medium">
                          {opportunity.talentsNeeded - opportunity.talentsApplied} remaining
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Description</p>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.description}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Requirements</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {opportunity.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="hero" onClick={() => handleApply(opportunity)}>
                      Submit Application
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No opportunities found matching your criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrowseOpportunities;
