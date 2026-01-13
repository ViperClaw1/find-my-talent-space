import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTalents } from "@/hooks/useTalents";
import { Skeleton } from "@/components/ui/skeleton";

interface TalentSelectorProps {
  selectedTalentId: string | null;
  onSelectTalent: (talentId: string | null) => void;
}

const TalentSelector = ({ selectedTalentId, onSelectTalent }: TalentSelectorProps) => {
  const { data: talents = [], isLoading } = useTalents();
  
  const selectedTalent = talents.find(t => t.id === selectedTalentId);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (talents.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-3 py-2">
        No talent profiles available
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2 truncate">
            {selectedTalent ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary-foreground">
                    {selectedTalent.avatar_initials || selectedTalent.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="truncate">{selectedTalent.name}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Select Talent Profile</span>
              </>
            )}
          </span>
          <ChevronDown className="w-4 h-4 flex-shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover border border-border shadow-lg">
        {talents.map((talent) => (
          <DropdownMenuItem 
            key={talent.id} 
            onClick={() => onSelectTalent(talent.id)}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-primary-foreground">
                {talent.avatar_initials || talent.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{talent.name}</p>
              <p className="text-xs text-muted-foreground truncate">{talent.category}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TalentSelector;
