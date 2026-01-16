import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventSectionProps {
  formData: {
    eventTab: string;
    eventTitle: string;
    eventCategory: string;
    existingEvent: string;
  };
  onChange: (field: string, value: string) => void;
  isRequired?: boolean;
}

const existingEvents = [
  { id: "1", name: "Summer Music Festival 2026", category: "Music" },
  { id: "2", name: "Corporate Annual Gala", category: "Corporate" },
  { id: "3", name: "Wedding Reception - Smith", category: "Wedding" },
  { id: "4", name: "Tech Conference 2026", category: "Conference" },
];

const eventCategories = [
  "Music",
  "Corporate",
  "Wedding",
  "Conference",
  "Private Party",
  "Sports",
  "Cultural",
  "Other",
];

const EventSection = ({ formData, onChange, isRequired }: EventSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold font-display">Event Details</h3>
        {!isRequired && (
          <span className="text-sm text-muted-foreground">(Optional)</span>
        )}
      </div>

      <Tabs
        value={formData.eventTab}
        onValueChange={(value) => onChange("eventTab", value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="new">Create New Event</TabsTrigger>
          <TabsTrigger value="existing">Select Existing</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="eventTitle">Event Title</Label>
            <Input
              id="eventTitle"
              placeholder="Enter event title..."
              className="bg-background"
              value={formData.eventTitle}
              onChange={(e) => onChange("eventTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventCategory">Event Category</Label>
            <Select
              value={formData.eventCategory}
              onValueChange={(value) => onChange("eventCategory", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-50">
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="existing" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="existingEvent">Select Event</Label>
            <Select
              value={formData.existingEvent}
              onValueChange={(value) => onChange("existingEvent", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-50">
                {existingEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name} ({event.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventSection;
