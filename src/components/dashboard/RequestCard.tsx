import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Users, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface RequestCardProps {
  id: string;
  type: "direct" | "open" | "time-slot";
  title: string;
  category: string;
  location: string;
  isVirtual: boolean;
  date: string;
  budget: number;
  status: "pending" | "active" | "completed" | "cancelled";
  talentsNeeded?: number;
  talentsApplied?: number;
  delay?: number;
  onClick?: () => void;
}

const RequestCard = ({
  type,
  title,
  category,
  location,
  isVirtual,
  date,
  budget,
  status,
  talentsNeeded,
  talentsApplied,
  delay = 0,
  onClick,
}: RequestCardProps) => {
  const typeColors = {
    direct: "bg-blue-100 text-blue-700",
    open: "bg-amber-100 text-amber-700",
    "time-slot": "bg-purple-100 text-purple-700",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-red-100 text-red-700",
  };

  const typeLabels = {
    direct: "Direct",
    open: "Open",
    "time-slot": "Time Slot",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2">
          <Badge className={typeColors[type]}>{typeLabels[type]}</Badge>
          <Badge className={statusColors[status]} variant="secondary">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{category}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{isVirtual ? "Virtual" : location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>${budget.toLocaleString()}</span>
        </div>
        {type === "open" && talentsNeeded && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {talentsApplied || 0}/{talentsNeeded} applied
            </span>
          </div>
        )}
        {type === "time-slot" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Multiple slots</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RequestCard;
