import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRequestApplications, useAcceptApplication, useRejectApplication } from "@/hooks/useApplications";
import { Loader2, Star, Check, X } from "lucide-react";
import { AcceptApplicationDialog } from "./AcceptApplicationDialog";

interface ApplicationsListProps {
  requestId: string;
  offeredAmount: number;
}

export const ApplicationsList = ({ requestId, offeredAmount }: ApplicationsListProps) => {
  const { data: applications = [], isLoading } = useRequestApplications(requestId);
  const [selectedApplication, setSelectedApplication] = useState<{
    id: string;
    talentName: string;
  } | null>(null);

  const rejectMutation = useRejectApplication();

  const handleReject = (applicationId: string) => {
    rejectMutation.mutate({ applicationId, requestId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No applications yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {application.talents.avatar_initials || application.talents.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{application.talents.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{application.talents.category}</span>
                    {application.talents.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {application.talents.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {application.status === "pending" ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(application.id)}
                      disabled={rejectMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedApplication({
                        id: application.id,
                        talentName: application.talents.name,
                      })}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                  </>
                ) : (
                  <Badge
                    variant={application.status === "accepted" ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {application.status}
                  </Badge>
                )}
              </div>
            </div>

            {application.message && (
              <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
                {application.message}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      <AcceptApplicationDialog
        open={!!selectedApplication}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
        applicationId={selectedApplication?.id || ""}
        requestId={requestId}
        talentName={selectedApplication?.talentName || ""}
        offeredAmount={offeredAmount}
      />
    </div>
  );
};
