import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Talent = Database["public"]["Tables"]["talents"]["Row"];

export const useTalents = () => {
  return useQuery({
    queryKey: ["talents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("is_available", true)
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data as Talent[];
    },
  });
};

export const useTalent = (talentId: string | null) => {
  return useQuery({
    queryKey: ["talent", talentId],
    queryFn: async () => {
      if (!talentId) return null;
      
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("id", talentId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Talent | null;
    },
    enabled: !!talentId,
  });
};

// Get talents associated with the current user
export const useMyTalentProfiles = () => {
  return useQuery({
    queryKey: ["my-talent-profiles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Talent[];
    },
  });
};
