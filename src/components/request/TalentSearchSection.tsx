import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useTalents } from "@/hooks/useTalents";

interface Talent {
  id: string;
  name: string;
  category: string;
  rating: number;
  avatar_initials: string | null;
}

interface TalentSearchSectionProps {
  selectedTalent: Talent | null;
  onSelectTalent: (talent: Talent | null) => void;
}

const TalentSearchSection = ({ selectedTalent, onSelectTalent }: TalentSearchSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { data: talents = [], isLoading } = useTalents();

  const filteredTalents = talents.filter(
    (talent) =>
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative z-20">
      <h3 className="text-lg font-semibold font-display">Select Talent</h3>

      {selectedTalent ? (
        <div className="flex items-center gap-4 p-4 bg-accent rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {selectedTalent.avatar_initials || selectedTalent.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium">{selectedTalent.name}</p>
            <p className="text-sm text-muted-foreground">{selectedTalent.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">⭐ {selectedTalent.rating}</span>
            <button
              onClick={() => onSelectTalent(null)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="space-y-2">
            <Label htmlFor="talentSearch">Search Talents</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="talentSearch"
                placeholder="Search by name or category..."
                className="pl-10 bg-background"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
            </div>
          </div>

          {showResults && searchQuery && (
            <div className="absolute z-[100] top-full mt-2 w-full bg-popover border border-border rounded-xl shadow-lg max-h-64 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTalents.length > 0 ? (
                filteredTalents.map((talent) => (
                  <button
                    key={talent.id}
                    className="w-full flex items-center gap-4 p-3 hover:bg-accent transition-colors text-left"
                    onClick={() => {
                      onSelectTalent({
                        id: talent.id,
                        name: talent.name,
                        category: talent.category,
                        rating: Number(talent.rating) || 5.0,
                        avatar_initials: talent.avatar_initials,
                      });
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {talent.avatar_initials || talent.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{talent.name}</p>
                      <p className="text-xs text-muted-foreground">{talent.category}</p>
                    </div>
                    <span className="text-xs font-medium">⭐ {talent.rating}</span>
                  </button>
                ))
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No talents found
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TalentSearchSection;
