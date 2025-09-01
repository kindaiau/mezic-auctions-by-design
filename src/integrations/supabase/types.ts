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
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
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
      xero_invoices: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          invoice_id: string | null
          job_id: string | null
          sync_status: string | null
          synced_at: string | null
          user_id: string | null
          xero_contact_id: string | null
          xero_invoice_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          job_id?: string | null
          sync_status?: string | null
          synced_at?: string | null
          user_id?: string | null
          xero_contact_id?: string | null
          xero_invoice_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          job_id?: string | null
          sync_status?: string | null
          synced_at?: string | null
          user_id?: string | null
          xero_contact_id?: string | null
          xero_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xero_invoices_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xero_invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "servicem8_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      xero_tokens: {
        Row: {
          access_token: string | null
          expires_at: string | null
          refresh_token: string | null
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: string | null
          refresh_token?: string | null
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          expires_at?: string | null
          refresh_token?: string | null
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      refresh_job_cost_summary: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
