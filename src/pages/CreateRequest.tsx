import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Clock, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ServiceDetailsSection from "@/components/request/ServiceDetailsSection";
import LocationDetailsSection from "@/components/request/LocationDetailsSection";
import EventSection from "@/components/request/EventSection";
import TalentSearchSection from "@/components/request/TalentSearchSection";
import TimeSlotSection from "@/components/request/TimeSlotSection";

type RequestType = "direct" | "open" | "time-slot";

interface Talent {
  id: string;
  name: string;
  category: string;
  rating: number;
  avatar: string;
}

const requestTypes = [
  {
    id: "direct" as RequestType,
    icon: Send,
    title: "Direct Request",
    description: "Send a request directly to a specific talent",
  },
  {
    id: "open" as RequestType,
    icon: Users,
    title: "Open Request",
    description: "Post an opportunity for talents to apply",
  },
  {
    id: "time-slot" as RequestType,
    icon: Clock,
    title: "Time-Slot Request",
    description: "Create an event with bookable time slots",
  },
];

const CreateRequest = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"client" | "talent">("client");
  const [step, setStep] = useState(1);
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  const [serviceData, setServiceData] = useState({
    serviceCategory: "",
    serviceType: "",
    serviceListing: "",
    offeredAmount: "",
    talentsNeeded: "1",
  });

  const [locationData, setLocationData] = useState({
    isVirtual: false,
    venueTbd: false,
    locationName: "",
    address: "",
    city: "",
    locationCategory: "",
    locationType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    admissionPrice: "",
    ageRestriction: "",
    otherTalents: "",
    specialNotes: "",
    meetingUrl: "",
    accessInstructions: "",
    attachments: [] as File[],
  });

  const [eventData, setEventData] = useState({
    eventTab: "new",
    eventTitle: "",
    eventCategory: "",
    existingEvent: "",
  });

  const [timeSlotData, setTimeSlotData] = useState({
    bookingMode: "reserve",
    visibility: "public",
    accessCode: "",
    timeType: "fixed",
    fixedStartTime: "",
    fixedEndTime: "",
    fixedSlots: "4",
    tiers: [{ id: "1", startTime: "", endTime: "", slots: "1" }],
  });

  const steps = ["Select Type", "Request Details"];
  const maxStep = 2;

  const handleNext = () => {
    if (step < maxStep) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    toast.success("Request created successfully!", {
      description: "Your request has been submitted and is now active.",
    });
    navigate("/dashboard");
  };

  const canProceed = () => {
    if (step === 1) return requestType !== null;
    if (step === 2) {
      const hasService = serviceData.serviceCategory && serviceData.offeredAmount;
      const hasLocation = locationData.startDate;
      if (requestType === "direct") return hasService && hasLocation && selectedTalent !== null;
      return hasService && hasLocation;
    }
    return true;
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">
              Create a New Request
            </h1>
            <p className="text-muted-foreground">
              Choose the type of request that best fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {requestTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setRequestType(type.id)}
                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left ${
                  requestType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    requestType === type.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <type.icon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                {requestType === type.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Step 2: All sections combined
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold font-display mb-1 capitalize">
            {requestType?.replace("-", " ")} Request
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details for your request
          </p>
        </div>

        {/* Talent Search - Only for Direct (first for direct requests) */}
        {requestType === "direct" && (
          <div className="glass-card rounded-2xl p-6 relative z-50">
            <TalentSearchSection
              selectedTalent={selectedTalent}
              onSelectTalent={setSelectedTalent}
            />
          </div>
        )}

        {/* Service Details */}
        <div className="glass-card rounded-2xl p-6 relative z-10">
          <ServiceDetailsSection
            formData={serviceData}
            onChange={(field, value) =>
              setServiceData((prev) => ({ ...prev, [field]: value }))
            }
            showTalentsNeeded={requestType === "open"}
          />
        </div>

        {/* Location Details */}
        <div className="glass-card rounded-2xl p-6 relative z-10">
          <LocationDetailsSection
            formData={locationData}
            onChange={(field, value) =>
              setLocationData((prev) => ({ ...prev, [field]: value }))
            }
          />
        </div>

        {/* Event Section - Required for Time-Slot, Optional for Open/Direct */}
        <div className="glass-card rounded-2xl p-6">
          <EventSection
            formData={eventData}
            onChange={(field, value) =>
              setEventData((prev) => ({ ...prev, [field]: value }))
            }
            isRequired={requestType === "time-slot"}
          />
        </div>

        {/* Time Slot Section - Only for Time-Slot */}
        {requestType === "time-slot" && (
          <div className="glass-card rounded-2xl p-6">
            <TimeSlotSection
              formData={timeSlotData}
              onChange={(field, value) =>
                setTimeSlotData((prev) => ({ ...prev, [field]: value }))
              }
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout userRole={userRole} onRoleChange={setUserRole}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepName, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1 < step ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index + 1 < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((stepName, index) => (
              <span key={index} className={index + 1 === step ? "text-foreground font-medium" : ""}>
                {stepName}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {step < maxStep ? (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit}>
              Submit Request
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateRequest;
