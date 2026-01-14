import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TalentServiceListing {
  id: string;
  talent_id: string;
  name: string;
  description: string | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export const useTalentServiceListings = (talentId: string | null) => {
  return useQuery({
    queryKey: ["talent-service-listings", talentId],
    queryFn: async () => {
      if (!talentId) return [];
      
      const { data, error } = await supabase
        .from("talent_service_listings")
        .select("*")
        .eq("talent_id", talentId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TalentServiceListing[];
    },
    enabled: !!talentId,
  });
};
