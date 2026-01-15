import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Calendar, DollarSign, Eye, CreditCard } from "lucide-react";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Flexible";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { className: string; label: string }> = {
    pending: { className: "bg-amber-100 text-amber-700", label: "Pending" },
    approved: { className: "bg-blue-100 text-blue-700", label: "Approved" },
    accepted: { className: "bg-green-100 text-green-700", label: "Confirmed" },
    rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },
  };

  const config = variants[status] || { className: "", label: status };

  return (
    <Badge className={`capitalize ${config.className}`}>
      {config.label}
    </Badge>
  );
};

interface ApplicationsTableProps {
  applications: any[];
  onPayToConfirm?: (application: any) => void;
}

export const ApplicationsTable = ({ applications, onPayToConfirm }: ApplicationsTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const request = application.requests;
            if (!request) return null;

            const isApproved = application.status === "approved";

            return (
              <TableRow key={application.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium">{request.service_category}</p>
                    {request.service_type && (
                      <p className="text-sm text-muted-foreground">{request.service_type}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {request.event_title || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{request.is_virtual ? "Virtual" : request.city || "TBD"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(request.start_date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-medium">
                    <DollarSign className="w-3 h-3" />
                    {Number(request.offered_amount).toFixed(0)}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(application.created_at)}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/dashboard/request/${request.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {isApproved && onPayToConfirm && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPayToConfirm(application);
                        }}
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
