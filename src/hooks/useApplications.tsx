import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface Application {
  id: string;
  request_id: string;
  talent_id: string;
  status: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

interface ApplicationWithTalent extends Application {
  talents: {
    id: string;
    name: string;
    category: string;
    avatar_initials: string | null;
    rating: number | null;
    hourly_rate: number | null;
  };
}

interface ApplicationWithRequest extends Application {
  requests: {
    id: string;
    request_type: string;
    service_category: string;
    event_title: string | null;
    offered_amount: number;
    talents_needed: number | null;
    status: string;
    city: string | null;
    start_date: string | null;
  };
}

// Hook for talents to get their applications
export const useMyApplications = (talentId: string | null, requestType?: "open" | "time-slot") => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-applications", talentId, requestType],
    queryFn: async () => {
      if (!user || !talentId) return [];

      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          requests (
            id,
            request_type,
            service_category,
            event_title,
            offered_amount,
            talents_needed,
            status,
            city,
            start_date
          )
        `,
        )
        .eq("talent_id", talentId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter by request type if specified
      let result = data as ApplicationWithRequest[];
      if (requestType) {
        result = result.filter((app) => app.requests?.request_type === requestType);
      }

      return result;
    },
    enabled: !!user && !!talentId,
  });
};

// Hook for talents to get their accepted applications (confirmed requests)
export const useMyConfirmedRequests = (talentId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-confirmed-requests", talentId],
    queryFn: async () => {
      if (!user || !talentId) return [];

      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          requests (
            id,
            request_type,
            service_category,
            event_title,
            offered_amount,
            talents_needed,
            status,
            city,
            start_date
          )
        `,
        )
        .eq("talent_id", talentId)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ApplicationWithRequest[];
    },
    enabled: !!user && !!talentId,
  });
};

// Hook for clients to get applications for a specific request
export const useRequestApplications = (requestId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["request-applications", requestId],
    queryFn: async () => {
      if (!user || !requestId) return [];

      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          talents (
            id,
            name,
            category,
            avatar_initials,
            rating,
            hourly_rate
          )
        `,
        )
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ApplicationWithTalent[];
    },
    enabled: !!user && !!requestId,
  });
};

// Hook for talents to apply to a request
export const useApplyToRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, talentId, message }: { requestId: string; talentId: string; message?: string }) => {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          request_id: requestId,
          talent_id: talentId,
          message: message || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["open-requests"] });
      toast.success("Application submitted successfully!");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("You have already applied to this request");
      } else {
        toast.error("Failed to submit application", { description: error.message });
      }
    },
  });
};

// Hook for clients to accept an application
export const useAcceptApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, requestId }: { applicationId: string; requestId: string }) => {
      // Update application status to accepted
      const { error: appError } = await supabase
        .from("applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);

      if (appError) throw appError;

      // Decrement talents_needed on the request
      const { data: request, error: reqFetchError } = await supabase
        .from("requests")
        .select("talents_needed")
        .eq("id", requestId)
        .single();

      if (reqFetchError) throw reqFetchError;

      const newTalentsNeeded = Math.max(0, (request.talents_needed || 1) - 1);

      const { error: reqUpdateError } = await supabase
        .from("requests")
        .update({ talents_needed: newTalentsNeeded })
        .eq("id", requestId);

      if (reqUpdateError) throw reqUpdateError;

      return { applicationId, requestId, newTalentsNeeded };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["request-applications", data.requestId] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Application accepted!");
    },
    onError: (error) => {
      toast.error("Failed to accept application", { description: error.message });
    },
  });
};

// Hook for clients to reject an application
export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, requestId }: { applicationId: string; requestId: string }) => {
      const { error } = await supabase.from("applications").update({ status: "rejected" }).eq("id", applicationId);

      if (error) throw error;
      return { applicationId, requestId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["request-applications", data.requestId] });
      toast.success("Application rejected");
    },
    onError: (error) => {
      toast.error("Failed to reject application", { description: error.message });
    },
  });
};

// Hook for clients to approve time-slot application (no popup, just update status)
export const useApproveTimeSlotApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, requestId }: { applicationId: string; requestId: string }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status: "approved" })
        .eq("id", applicationId);

      if (error) throw error;
      return { applicationId, requestId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["request-applications", data.requestId] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      toast.success("Application approved! Waiting for talent to confirm payment.");
    },
    onError: (error) => {
      toast.error("Failed to approve application", { description: error.message });
    },
  });
};

// Hook for talents to confirm payment after approval
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      requestId,
      tierId,
      slotIndex,
    }: { 
      applicationId: string; 
      requestId: string;
      tierId?: string | null;
      slotIndex?: number | null;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Update application status to accepted (confirmed)
      const { error: appError } = await supabase
        .from("applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);

      if (appError) throw appError;

      // Get the application to find talent_id
      const { data: application, error: fetchAppError } = await supabase
        .from("applications")
        .select("talent_id")
        .eq("id", applicationId)
        .single();

      if (fetchAppError) throw fetchAppError;

      // Create a reservation record to track slot availability
      if (tierId !== undefined || slotIndex !== undefined) {
        const { error: resError } = await supabase
          .from("time_slot_reservations")
          .insert({
            request_id: requestId,
            tier_id: tierId || null,
            slot_index: slotIndex ?? null,
            talent_id: application.talent_id,
            status: "confirmed",
          });

        if (resError) throw resError;
      }

      // Decrement talents_needed on the request for non-time-slot requests
      const { data: request, error: reqFetchError } = await supabase
        .from("requests")
        .select("talents_needed, request_type, time_type, tiers")
        .eq("id", requestId)
        .single();

      if (reqFetchError) throw reqFetchError;

      if (request.request_type !== "time-slot") {
        const newTalentsNeeded = Math.max(0, (request.talents_needed || 1) - 1);
        const { error: reqUpdateError } = await supabase
          .from("requests")
          .update({ talents_needed: newTalentsNeeded })
          .eq("id", requestId);

        if (reqUpdateError) throw reqUpdateError;
      }

      return { applicationId, requestId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["request-applications", data.requestId] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["my-confirmed-requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["time-slot-reservations"] });
      toast.success("Payment confirmed! Booking is now active.");
    },
    onError: (error) => {
      toast.error("Failed to confirm payment", { description: error.message });
    },
  });
};

export const useOpenRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["open-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("request_type", "open")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useTimeSlotRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["time-slot-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("request_type", "time-slot")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

// Hook to check if talent has already applied to a request
export const useHasApplied = (requestId: string, talentId: string | null) => {
  return useQuery({
    queryKey: ["has-applied", requestId, talentId],
    queryFn: async () => {
      if (!talentId) return false;

      const { data, error } = await supabase
        .from("applications")
        .select("id")
        .eq("request_id", requestId)
        .eq("talent_id", talentId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!talentId,
  });
};

// Hook to get application count for a request
export const useApplicationCount = (requestId: string) => {
  return useQuery({
    queryKey: ["application-count", requestId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("request_id", requestId);

      if (error) throw error;
      return count || 0;
    },
  });
};

// Hook to create a time-slot reservation (instant booking)
export const useCreateTimeSlotReservation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      parentRequestId,
      talentId,
      talentName,
      selectedSlot,
      offeredAmount,
      serviceCategory,
      eventTitle,
    }: {
      parentRequestId: string;
      talentId: string;
      talentName: string;
      selectedSlot: { startTime: string; endTime: string; label: string };
      offeredAmount: number;
      serviceCategory: string;
      eventTitle: string | null;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Get the parent request to copy relevant fields
      const { data: parentRequest, error: fetchError } = await supabase
        .from("requests")
        .select("*")
        .eq("id", parentRequestId)
        .single();

      if (fetchError) throw fetchError;

      // Create a new direct request representing the reservation
      const { data, error } = await supabase
        .from("requests")
        .insert({
          user_id: parentRequest.user_id,
          request_type: "direct",
          status: "accepted",
          talent_id: talentId,
          talent_name: talentName,
          service_category: serviceCategory,
          service_type: parentRequest.service_type,
          offered_amount: offeredAmount,
          service_fee: offeredAmount * 0.1,
          total_amount: offeredAmount * 1.1,
          event_title: eventTitle,
          start_date: parentRequest.start_date,
          end_date: parentRequest.end_date,
          fixed_start_time: selectedSlot.startTime,
          fixed_end_time: selectedSlot.endTime,
          city: parentRequest.city,
          location_name: parentRequest.location_name,
          address: parentRequest.address,
          is_virtual: parentRequest.is_virtual,
          venue_tbd: parentRequest.venue_tbd,
          special_notes: `Reserved from time-slot request. Slot: ${selectedSlot.label}`,
        })
        .select()
        .single();

      if (error) throw error;

      // Also create an application record for tracking
      await supabase
        .from("applications")
        .insert({
          request_id: parentRequestId,
          talent_id: talentId,
          status: "accepted",
          message: `Reserved slot: ${selectedSlot.label}`,
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["time-slot-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      toast.success("Time slot reserved successfully!");
    },
    onError: (error) => {
      toast.error("Failed to reserve time slot", { description: error.message });
    },
  });
};
