import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceDetailsSectionProps {
  formData: {
    serviceCategory: string;
    serviceType: string;
    serviceListing: string;
    offeredAmount: string;
    talentsNeeded?: string;
  };
  onChange: (field: string, value: string) => void;
  showTalentsNeeded?: boolean;
}

const serviceCategories = [
  "Music & Entertainment",
  "Photography & Videography",
  "Event Planning",
  "Catering & Food",
  "Beauty & Wellness",
  "Sports & Fitness",
  "Education & Tutoring",
  "Technology & IT",
];

const serviceTypes: Record<string, string[]> = {
  "Music & Entertainment": ["DJ", "Live Band", "Solo Artist", "MC/Host", "Dancer"],
  "Photography & Videography": ["Photographer", "Videographer", "Drone Operator"],
  "Event Planning": ["Event Planner", "Decorator", "Coordinator"],
  "Catering & Food": ["Chef", "Bartender", "Caterer", "Baker"],
  "Beauty & Wellness": ["Makeup Artist", "Hair Stylist", "Massage Therapist"],
  "Sports & Fitness": ["Personal Trainer", "Yoga Instructor", "Coach"],
  "Education & Tutoring": ["Tutor", "Workshop Facilitator", "Speaker"],
  "Technology & IT": ["Developer", "Designer", "Consultant"],
};

const ServiceDetailsSection = ({ formData, onChange, showTalentsNeeded }: ServiceDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold font-display">Service Details</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceCategory">Service Category</Label>
          <Select
            value={formData.serviceCategory}
            onValueChange={(value) => onChange("serviceCategory", value)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select
            value={formData.serviceType}
            onValueChange={(value) => onChange("serviceType", value)}
            disabled={!formData.serviceCategory}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {formData.serviceCategory &&
                serviceTypes[formData.serviceCategory]?.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceListing">Service Listing</Label>
          <Select
            value={formData.serviceListing}
            onValueChange={(value) => onChange("serviceListing", value)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select listing" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              <SelectItem value="standard">Standard Service</SelectItem>
              <SelectItem value="premium">Premium Service</SelectItem>
              <SelectItem value="custom">Custom Package</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offeredAmount">Offered Amount (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="offeredAmount"
              type="number"
              placeholder="0.00"
              className="pl-7 bg-background"
              value={formData.offeredAmount}
              onChange={(e) => onChange("offeredAmount", e.target.value)}
            />
          </div>
        </div>

        {showTalentsNeeded && (
          <div className="space-y-2">
            <Label htmlFor="talentsNeeded">Number of Talents Needed</Label>
            <Input
              id="talentsNeeded"
              type="number"
              min="1"
              placeholder="1"
              className="bg-background"
              value={formData.talentsNeeded || ""}
              onChange={(e) => onChange("talentsNeeded", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsSection;
