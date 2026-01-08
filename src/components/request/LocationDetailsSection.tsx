import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationDetailsSectionProps {
  formData: {
    isVirtual: boolean;
    venueTbd: boolean;
    locationCategory: string;
    locationType: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    admissionPrice: string;
    ageRestriction: string;
    otherTalents: string;
    specialNotes: string;
  };
  onChange: (field: string, value: string | boolean) => void;
}

const locationCategories = [
  "Indoor Venue",
  "Outdoor Venue",
  "Studio",
  "Private Residence",
  "Corporate Office",
  "Restaurant/Bar",
  "Hotel",
  "Other",
];

const locationTypes: Record<string, string[]> = {
  "Indoor Venue": ["Concert Hall", "Conference Center", "Ballroom", "Theater"],
  "Outdoor Venue": ["Park", "Beach", "Rooftop", "Garden"],
  "Studio": ["Recording Studio", "Photo Studio", "Dance Studio"],
  "Private Residence": ["Home", "Backyard", "Pool Area"],
  "Corporate Office": ["Meeting Room", "Event Space", "Lobby"],
  "Restaurant/Bar": ["Private Dining", "Bar Area", "Patio"],
  "Hotel": ["Ballroom", "Conference Room", "Suite"],
  "Other": ["Other"],
};

const LocationDetailsSection = ({ formData, onChange }: LocationDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold font-display">Location Details</h3>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-3">
          <Switch
            id="isVirtual"
            checked={formData.isVirtual}
            onCheckedChange={(checked) => onChange("isVirtual", checked)}
          />
          <Label htmlFor="isVirtual">Virtual Event</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            id="venueTbd"
            checked={formData.venueTbd}
            onCheckedChange={(checked) => onChange("venueTbd", checked)}
            disabled={formData.isVirtual}
          />
          <Label htmlFor="venueTbd">Venue TBD</Label>
        </div>
      </div>

      {!formData.isVirtual && !formData.venueTbd && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="locationCategory">Location Category</Label>
            <Select
              value={formData.locationCategory}
              onValueChange={(value) => onChange("locationCategory", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-50">
                {locationCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location Type</Label>
            <Select
              value={formData.locationType}
              onValueChange={(value) => onChange("locationType", value)}
              disabled={!formData.locationCategory}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-50">
                {formData.locationCategory &&
                  locationTypes[formData.locationCategory]?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            className="bg-background"
            value={formData.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            className="bg-background"
            value={formData.startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            className="bg-background"
            value={formData.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            className="bg-background"
            value={formData.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="admissionPrice">Price of Admission (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="admissionPrice"
              type="number"
              placeholder="0.00"
              className="pl-7 bg-background"
              value={formData.admissionPrice}
              onChange={(e) => onChange("admissionPrice", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ageRestriction">Age Restriction</Label>
          <Select
            value={formData.ageRestriction}
            onValueChange={(value) => onChange("ageRestriction", value)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select restriction" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              <SelectItem value="all-ages">All Ages</SelectItem>
              <SelectItem value="18+">18+</SelectItem>
              <SelectItem value="21+">21+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherTalents">Other Talents Invited</Label>
        <Input
          id="otherTalents"
          placeholder="Enter names of other talents..."
          className="bg-background"
          value={formData.otherTalents}
          onChange={(e) => onChange("otherTalents", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialNotes">Special Notes / Instructions</Label>
        <Textarea
          id="specialNotes"
          placeholder="Any special requirements or instructions..."
          className="bg-background min-h-[100px]"
          value={formData.specialNotes}
          onChange={(e) => onChange("specialNotes", e.target.value)}
        />
      </div>
    </div>
  );
};

export default LocationDetailsSection;
