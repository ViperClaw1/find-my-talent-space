import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Request = Database["public"]["Tables"]["requests"]["Row"];
type RequestInsert = Database["public"]["Tables"]["requests"]["Insert"];
type RequestType = Database["public"]["Enums"]["request_type"];

export const useRequests = (type?: RequestType) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["requests", user?.id, type],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (type) {
        query = query.eq("request_type", type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Request[];
    },
    enabled: !!user,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (requestData: Omit<RequestInsert, "user_id">) => {
      if (!user) throw new Error("You must be logged in to create a request");
      
      const { data, error } = await supabase
        .from("requests")
        .insert({
          ...requestData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create request", { description: error.message });
    },
  });
};
