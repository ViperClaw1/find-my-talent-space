import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Reservation {
  id: string;
  request_id: string;
  tier_id: string | null;
  slot_index: number | null;
  talent_id: string;
  status: string;
  created_at: string;
}

// Get reservations for a specific time-slot request
export const useTimeSlotReservations = (requestId: string | null) => {
  return useQuery({
    queryKey: ["time-slot-reservations", requestId],
    queryFn: async () => {
      if (!requestId) return [];

      const { data, error } = await supabase
        .from("time_slot_reservations")
        .select("*")
        .eq("request_id", requestId)
        .eq("status", "confirmed");

      if (error) throw error;
      return data as Reservation[];
    },
    enabled: !!requestId,
  });
};

// Calculate available slots for a time-slot request
export const useAvailableSlots = (
  requestId: string | null,
  timeType: string | null,
  tiers: any[] | null,
  fixedSlots: number | null
) => {
  const { data: reservations = [] } = useTimeSlotReservations(requestId);

  if (timeType === "tier" && tiers) {
    // For tier-based, count reservations per tier
    return tiers.map((tier) => {
      const tierReservations = reservations.filter(r => r.tier_id === tier.id);
      const totalSlots = parseInt(tier.slots || "0");
      const reservedCount = tierReservations.length;
      return {
        ...tier,
        availableSlots: Math.max(0, totalSlots - reservedCount),
        totalSlots,
        isAvailable: reservedCount < totalSlots,
      };
    });
  }

  if (timeType === "fixed" && fixedSlots) {
    // For fixed slots, check which slot indices are reserved
    const slots = [];
    for (let i = 0; i < fixedSlots; i++) {
      const isReserved = reservations.some(r => r.slot_index === i);
      slots.push({
        index: i,
        isAvailable: !isReserved,
      });
    }
    return slots;
  }

  return [];
};