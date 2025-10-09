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
      bank_transactions: {
        Row: {
          bank_account_id: string | null
          contact_name: string | null
          created_at: string
          currency_code: string | null
          date: string | null
          id: string
          line_items: Json | null
          raw_data: Json | null
          reference: string | null
          status: string | null
          total_amount: number | null
          type: string | null
          updated_at: string
          user_id: string
          xero_bank_transaction_id: string
        }
        Insert: {
          bank_account_id?: string | null
          contact_name?: string | null
          created_at?: string
          currency_code?: string | null
          date?: string | null
          id?: string
          line_items?: Json | null
          raw_data?: Json | null
          reference?: string | null
          status?: string | null
          total_amount?: number | null
          type?: string | null
          updated_at?: string
          user_id: string
          xero_bank_transaction_id: string
        }
        Update: {
          bank_account_id?: string | null
          contact_name?: string | null
          created_at?: string
          currency_code?: string | null
          date?: string | null
          id?: string
          line_items?: Json | null
          raw_data?: Json | null
          reference?: string | null
          status?: string | null
          total_amount?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
          xero_bank_transaction_id?: string
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
          status: string
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
          status?: string
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
          status?: string
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
      booking_approvals: {
        Row: {
          approval_notes: string | null
          approval_status: string
          approved_at: string
          approved_by: string
          id: string
          quote_id: string
        }
        Insert: {
          approval_notes?: string | null
          approval_status: string
          approved_at?: string
          approved_by: string
          id?: string
          quote_id: string
        }
        Update: {
          approval_notes?: string | null
          approval_status?: string
          approved_at?: string
          approved_by?: string
          id?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_approvals_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "water_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow_analysis: {
        Row: {
          analysis_date: string
          confidence_score: number | null
          created_at: string
          forecast_next_period: number | null
          id: string
          net_cash_flow: number | null
          period_type: string | null
          reece_percentage: number | null
          reece_spend: number | null
          top_expense_category: string | null
          total_expenses: number | null
          total_income: number | null
          user_id: string
        }
        Insert: {
          analysis_date: string
          confidence_score?: number | null
          created_at?: string
          forecast_next_period?: number | null
          id?: string
          net_cash_flow?: number | null
          period_type?: string | null
          reece_percentage?: number | null
          reece_spend?: number | null
          top_expense_category?: string | null
          total_expenses?: number | null
          total_income?: number | null
          user_id: string
        }
        Update: {
          analysis_date?: string
          confidence_score?: number | null
          created_at?: string
          forecast_next_period?: number | null
          id?: string
          net_cash_flow?: number | null
          period_type?: string | null
          reece_percentage?: number | null
          reece_spend?: number | null
          top_expense_category?: string | null
          total_expenses?: number | null
          total_income?: number | null
          user_id?: string
        }
        Relationships: []
      }
      cash_flow_forecast: {
        Row: {
          admin_overhead: number | null
          created_at: string
          equipment_hire: number | null
          expected_income: number | null
          fuel: number | null
          id: string
          net_cash_flow: number | null
          notes: string | null
          payroll: number | null
          reece_materials: number | null
          subcontractor: number | null
          total_expenses: number | null
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          admin_overhead?: number | null
          created_at?: string
          equipment_hire?: number | null
          expected_income?: number | null
          fuel?: number | null
          id?: string
          net_cash_flow?: number | null
          notes?: string | null
          payroll?: number | null
          reece_materials?: number | null
          subcontractor?: number | null
          total_expenses?: number | null
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          admin_overhead?: number | null
          created_at?: string
          equipment_hire?: number | null
          expected_income?: number | null
          fuel?: number | null
          id?: string
          net_cash_flow?: number | null
          notes?: string | null
          payroll?: number | null
          reece_materials?: number | null
          subcontractor?: number | null
          total_expenses?: number | null
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
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
          phone: string | null
          preferences: Json | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          phone?: string | null
          preferences?: Json | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          phone?: string | null
          preferences?: Json | null
          subscribed_at?: string
        }
        Relationships: []
      }
      google_sheets_connections: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          last_synced: string | null
          name: string
          sheet_id: string
          sheet_url: string | null
          sync_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_synced?: string | null
          name: string
          sheet_id: string
          sheet_url?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_synced?: string | null
          name?: string
          sheet_id?: string
          sheet_url?: string | null
          sync_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invoice_id: string | null
          line_total: number | null
          product_code: string | null
          quantity: number | null
          unit_price: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number | null
          product_code?: string | null
          quantity?: number | null
          unit_price?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number | null
          product_code?: string | null
          quantity?: number | null
          unit_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_processing_log: {
        Row: {
          created_at: string | null
          details: Json | null
          error_message: string | null
          id: string
          invoice_id: string | null
          processing_step: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          processing_step: string
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          processing_step?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_processing_log_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          category: string | null
          created_at: string
          id: string
          invoice_date: string | null
          invoice_number: string
          job_id: string | null
          job_number: string | null
          matched_job_id: string | null
          pdf_url: string | null
          processing_status: string | null
          raw_data: Json | null
          supplier: string
          total_amount: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          invoice_date?: string | null
          invoice_number: string
          job_id?: string | null
          job_number?: string | null
          matched_job_id?: string | null
          pdf_url?: string | null
          processing_status?: string | null
          raw_data?: Json | null
          supplier?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          job_id?: string | null
          job_number?: string | null
          matched_job_id?: string | null
          pdf_url?: string | null
          processing_status?: string | null
          raw_data?: Json | null
          supplier?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "servicem8_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_matched_job_id_fkey"
            columns: ["matched_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          actual_cost: number | null
          client_name: string | null
          completion_date: string | null
          created_at: string
          estimated_value: number | null
          id: string
          job_number: string
          job_status: string | null
          job_title: string | null
          notes: string | null
          profit_margin: number | null
          start_date: string | null
          technician: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          client_name?: string | null
          completion_date?: string | null
          created_at?: string
          estimated_value?: number | null
          id?: string
          job_number: string
          job_status?: string | null
          job_title?: string | null
          notes?: string | null
          profit_margin?: number | null
          start_date?: string | null
          technician?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          client_name?: string | null
          completion_date?: string | null
          created_at?: string
          estimated_value?: number | null
          id?: string
          job_number?: string
          job_status?: string | null
          job_title?: string | null
          notes?: string | null
          profit_margin?: number | null
          start_date?: string | null
          technician?: string | null
          updated_at?: string
          user_id?: string
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
      servicem8_jobs: {
        Row: {
          created_at: string
          created_date: string | null
          customer_name: string | null
          id: string
          job_address: string | null
          job_number: string
          job_status: string | null
          job_uuid: string | null
          last_synced: string | null
          raw_data: Json | null
          total_value: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_date?: string | null
          customer_name?: string | null
          id?: string
          job_address?: string | null
          job_number: string
          job_status?: string | null
          job_uuid?: string | null
          last_synced?: string | null
          raw_data?: Json | null
          total_value?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_date?: string | null
          customer_name?: string | null
          id?: string
          job_address?: string | null
          job_number?: string
          job_status?: string | null
          job_uuid?: string | null
          last_synced?: string | null
          raw_data?: Json | null
          total_value?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      spend_summary: {
        Row: {
          category: string | null
          created_at: string
          id: string
          invoice_count: number
          month_year: string
          percentage_of_total: number | null
          supplier: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          invoice_count?: number
          month_year: string
          percentage_of_total?: number | null
          supplier: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          invoice_count?: number
          month_year?: string
          percentage_of_total?: number | null
          supplier?: string
          total_amount?: number
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
      water_bookings: {
        Row: {
          booking_reference: string
          confirmed_date: string
          confirmed_price: number
          created_at: string
          delivery_notes: string | null
          delivery_status: string
          id: string
          quote_id: string
          updated_at: string
        }
        Insert: {
          booking_reference: string
          confirmed_date: string
          confirmed_price: number
          created_at?: string
          delivery_notes?: string | null
          delivery_status?: string
          id?: string
          quote_id: string
          updated_at?: string
        }
        Update: {
          booking_reference?: string
          confirmed_date?: string
          confirmed_price?: number
          created_at?: string
          delivery_notes?: string | null
          delivery_status?: string
          id?: string
          quote_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_bookings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "water_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      water_quotes: {
        Row: {
          calculated_price: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id: string
          notes: string | null
          preferred_date: string
          price_breakdown: Json
          quantity_kl: number
          status: string
          updated_at: string
          water_type: string
        }
        Insert: {
          calculated_price: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id?: string
          notes?: string | null
          preferred_date: string
          price_breakdown: Json
          quantity_kl: number
          status?: string
          updated_at?: string
          water_type: string
        }
        Update: {
          calculated_price?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          id?: string
          notes?: string | null
          preferred_date?: string
          price_breakdown?: Json
          quantity_kl?: number
          status?: string
          updated_at?: string
          water_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      refresh_job_cost_summary: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
