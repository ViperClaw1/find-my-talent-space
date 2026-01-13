export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          request_id: string
          status: string
          talent_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          request_id: string
          status?: string
          talent_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          request_id?: string
          status?: string
          talent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talents"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          access_code: string | null
          access_instructions: string | null
          address: string | null
          admission_price: string | null
          age_restriction: string | null
          booking_mode: string | null
          city: string | null
          created_at: string
          end_date: string | null
          event_category: string | null
          event_title: string | null
          fixed_end_time: string | null
          fixed_slots: number | null
          fixed_start_time: string | null
          id: string
          is_virtual: boolean | null
          location_category: string | null
          location_name: string | null
          location_type: string | null
          meeting_url: string | null
          offered_amount: number
          other_talents: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          service_category: string
          service_fee: number | null
          service_listing: string | null
          service_type: string | null
          special_notes: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["request_status"]
          talent_category: string | null
          talent_id: string | null
          talent_name: string | null
          talents_needed: number | null
          tiers: Json | null
          time_type: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
          venue_tbd: boolean | null
          visibility: string | null
        }
        Insert: {
          access_code?: string | null
          access_instructions?: string | null
          address?: string | null
          admission_price?: string | null
          age_restriction?: string | null
          booking_mode?: string | null
          city?: string | null
          created_at?: string
          end_date?: string | null
          event_category?: string | null
          event_title?: string | null
          fixed_end_time?: string | null
          fixed_slots?: number | null
          fixed_start_time?: string | null
          id?: string
          is_virtual?: boolean | null
          location_category?: string | null
          location_name?: string | null
          location_type?: string | null
          meeting_url?: string | null
          offered_amount: number
          other_talents?: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          service_category: string
          service_fee?: number | null
          service_listing?: string | null
          service_type?: string | null
          special_notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          talent_category?: string | null
          talent_id?: string | null
          talent_name?: string | null
          talents_needed?: number | null
          tiers?: Json | null
          time_type?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
          venue_tbd?: boolean | null
          visibility?: string | null
        }
        Update: {
          access_code?: string | null
          access_instructions?: string | null
          address?: string | null
          admission_price?: string | null
          age_restriction?: string | null
          booking_mode?: string | null
          city?: string | null
          created_at?: string
          end_date?: string | null
          event_category?: string | null
          event_title?: string | null
          fixed_end_time?: string | null
          fixed_slots?: number | null
          fixed_start_time?: string | null
          id?: string
          is_virtual?: boolean | null
          location_category?: string | null
          location_name?: string | null
          location_type?: string | null
          meeting_url?: string | null
          offered_amount?: number
          other_talents?: string | null
          request_type?: Database["public"]["Enums"]["request_type"]
          service_category?: string
          service_fee?: number | null
          service_listing?: string | null
          service_type?: string | null
          special_notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          talent_category?: string | null
          talent_id?: string | null
          talent_name?: string | null
          talents_needed?: number | null
          tiers?: Json | null
          time_type?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
          venue_tbd?: boolean | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_requests_talent"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talents"
            referencedColumns: ["id"]
          },
        ]
      }
      talents: {
        Row: {
          avatar_initials: string | null
          bio: string | null
          category: string
          created_at: string
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          name: string
          rating: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_initials?: string | null
          bio?: string | null
          category: string
          created_at?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          name: string
          rating?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_initials?: string | null
          bio?: string | null
          category?: string
          created_at?: string
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          name?: string
          rating?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      request_status:
        | "pending"
        | "accepted"
        | "declined"
        | "completed"
        | "cancelled"
      request_type: "direct" | "open" | "time-slot"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      request_status: [
        "pending",
        "accepted",
        "declined",
        "completed",
        "cancelled",
      ],
      request_type: ["direct", "open", "time-slot"],
    },
  },
} as const
