import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Lock, Globe, EyeOff } from "lucide-react";

interface Tier {
  id: string;
  startTime: string;
  endTime: string;
  slots: string;
}

interface TimeSlotSectionProps {
  formData: {
    bookingMode: string;
    visibility: string;
    timeType: string;
    fixedStartTime: string;
    fixedEndTime: string;
    fixedSlots: string;
    tiers: Tier[];
  };
  onChange: (field: string, value: string | Tier[]) => void;
}

const TimeSlotSection = ({ formData, onChange }: TimeSlotSectionProps) => {
  const addTier = () => {
    const newTier: Tier = {
      id: Date.now().toString(),
      startTime: "",
      endTime: "",
      slots: "1",
    };
    onChange("tiers", [...formData.tiers, newTier]);
  };

  const updateTier = (id: string, field: keyof Tier, value: string) => {
    const updatedTiers = formData.tiers.map((tier) =>
      tier.id === id ? { ...tier, [field]: value } : tier
    );
    onChange("tiers", updatedTiers);
  };

  const removeTier = (id: string) => {
    onChange("tiers", formData.tiers.filter((tier) => tier.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Booking Mode */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-display">Booking Mode</h3>
        <RadioGroup
          value={formData.bookingMode}
          onValueChange={(value) => onChange("bookingMode", value)}
          className="grid grid-cols-2 gap-4"
        >
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.bookingMode === "reserve"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="reserve" id="reserve" />
            <div>
              <p className="font-medium">Reserve (Instant)</p>
              <p className="text-sm text-muted-foreground">Talents can book instantly</p>
            </div>
          </label>
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.bookingMode === "apply"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="apply" id="apply" />
            <div>
              <p className="font-medium">Apply (Approval)</p>
              <p className="text-sm text-muted-foreground">Requires your approval</p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Visibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-display">Visibility</h3>
        <RadioGroup
          value={formData.visibility}
          onValueChange={(value) => onChange("visibility", value)}
          className="grid grid-cols-3 gap-4"
        >
          <label
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.visibility === "public"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="public" id="public" className="sr-only" />
            <Globe className="w-6 h-6 text-primary" />
            <p className="font-medium text-sm">Public</p>
          </label>
          <label
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.visibility === "unlisted"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="unlisted" id="unlisted" className="sr-only" />
            <EyeOff className="w-6 h-6 text-primary" />
            <p className="font-medium text-sm">Unlisted</p>
          </label>
          <label
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.visibility === "code-gated"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="code-gated" id="code-gated" className="sr-only" />
            <Lock className="w-6 h-6 text-primary" />
            <p className="font-medium text-sm">Code-Gated</p>
          </label>
        </RadioGroup>
      </div>

      {/* Time Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-display">Time Details</h3>
        <RadioGroup
          value={formData.timeType}
          onValueChange={(value) => onChange("timeType", value)}
          className="grid grid-cols-2 gap-4"
        >
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.timeType === "fixed"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="fixed" id="fixed" />
            <div>
              <p className="font-medium">Fixed Slots</p>
              <p className="text-sm text-muted-foreground">Divide time into equal gaps</p>
            </div>
          </label>
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              formData.timeType === "tier"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="tier" id="tier" />
            <div>
              <p className="font-medium">Custom Tiers</p>
              <p className="text-sm text-muted-foreground">Define custom time ranges</p>
            </div>
          </label>
        </RadioGroup>

        {formData.timeType === "fixed" && (
          <div className="grid md:grid-cols-3 gap-4 mt-4 p-4 bg-muted/50 rounded-xl">
            <div className="space-y-2">
              <Label htmlFor="fixedStartTime">Start Time</Label>
              <Input
                id="fixedStartTime"
                type="time"
                className="bg-background"
                value={formData.fixedStartTime}
                onChange={(e) => onChange("fixedStartTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fixedEndTime">End Time</Label>
              <Input
                id="fixedEndTime"
                type="time"
                className="bg-background"
                value={formData.fixedEndTime}
                onChange={(e) => onChange("fixedEndTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fixedSlots">Number of Slots</Label>
              <Input
                id="fixedSlots"
                type="number"
                min="1"
                className="bg-background"
                value={formData.fixedSlots}
                onChange={(e) => onChange("fixedSlots", e.target.value)}
              />
            </div>
          </div>
        )}

        {formData.timeType === "tier" && (
          <div className="space-y-4 mt-4">
            {formData.tiers.map((tier, index) => (
              <div
                key={tier.id}
                className="grid md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl"
              >
                <div className="space-y-2">
                  <Label>Tier {index + 1} Start</Label>
                  <Input
                    type="time"
                    className="bg-background"
                    value={tier.startTime}
                    onChange={(e) => updateTier(tier.id, "startTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tier {index + 1} End</Label>
                  <Input
                    type="time"
                    className="bg-background"
                    value={tier.endTime}
                    onChange={(e) => updateTier(tier.id, "endTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slots</Label>
                  <Input
                    type="number"
                    min="1"
                    className="bg-background"
                    value={tier.slots}
                    onChange={(e) => updateTier(tier.id, "slots", e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTier(tier.id)}
                    disabled={formData.tiers.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTier}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSection;
