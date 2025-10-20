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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      auction_submissions: {
        Row: {
          admin_notes: string | null
          artist: string
          created_at: string
          description: string | null
          end_time: string
          id: string
          image_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          starting_bid: number
          status: string
          submitted_at: string
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          artist: string
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          image_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          starting_bid: number
          status?: string
          submitted_at?: string
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          artist?: string
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          image_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          starting_bid?: number
          status?: string
          submitted_at?: string
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      auctions: {
        Row: {
          artist: string
          created_at: string
          current_bid: number
          description: string | null
          end_time: string
          id: string
          image_url: string
          starting_bid: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          artist: string
          created_at?: string
          current_bid: number
          description?: string | null
          end_time: string
          id?: string
          image_url: string
          starting_bid: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          artist?: string
          created_at?: string
          current_bid?: number
          description?: string | null
          end_time?: string
          id?: string
          image_url?: string
          starting_bid?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          operation: string
          record_id: string | null
          sensitive_data_accessed: Json | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          operation: string
          record_id?: string | null
          sensitive_data_accessed?: Json | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          operation?: string
          record_id?: string | null
          sensitive_data_accessed?: Json | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bid_notifications: {
        Row: {
          bid_id: string | null
          id: string
          notification_type: string
          sent_at: string
          status: string
        }
        Insert: {
          bid_id?: string | null
          id?: string
          notification_type: string
          sent_at?: string
          status?: string
        }
        Update: {
          bid_id?: string | null
          id?: string
          notification_type?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_notifications_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_time: string
          bidder_email: string
          bidder_name: string
          bidder_phone: string | null
          created_at: string
          id: string
          maximum_bid_amount: number
          status: string
          submitted_bid_amount: number
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_time?: string
          bidder_email: string
          bidder_name: string
          bidder_phone?: string | null
          created_at?: string
          id?: string
          maximum_bid_amount: number
          status?: string
          submitted_bid_amount: number
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_time?: string
          bidder_email?: string
          bidder_name?: string
          bidder_phone?: string | null
          created_at?: string
          id?: string
          maximum_bid_amount?: number
          status?: string
          submitted_bid_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          phone: string
          status: string
          submitted_at: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          phone: string
          status?: string
          submitted_at?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          phone?: string
          status?: string
          submitted_at?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          phone: string | null
          preferences: Json | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          subscribed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      water_quotes: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          calculated_price: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivery_address: string
          id: string
          preferred_date: string
          price_breakdown: Json | null
          quantity_kl: number
          status: string
          updated_at: string
          water_type: string
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          calculated_price: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivery_address: string
          id?: string
          preferred_date: string
          price_breakdown?: Json | null
          quantity_kl: number
          status?: string
          updated_at?: string
          water_type: string
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          calculated_price?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: string
          id?: string
          preferred_date?: string
          price_breakdown?: Json | null
          quantity_kl?: number
          status?: string
          updated_at?: string
          water_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      auction_bid_counts: {
        Row: {
          auction_id: string | null
          bid_count: number | null
          current_high_bid: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      detect_suspicious_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          access_count: number
          first_access: string
          last_access: string
          unique_records_accessed: number
          user_id: string
        }[]
      }
      encrypt_customer_data: {
        Args: { data: string }
        Returns: string
      }
      ensure_admin_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_bids: {
        Args: Record<PropertyKey, never>
        Returns: {
          auction_id: string
          bid_amount: number
          bid_time: string
          id: string
          status: string
          submitted_bid_amount: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_admin_with_audit: {
        Args: {
          operation: string
          record_id?: string
          sensitive_fields?: Json
          table_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
