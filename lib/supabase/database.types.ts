export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      feedback: {
        Row: {
          created_at: string
          feel: Database["public"]["Enums"]["FEEDBACK_FEEL"]
          id: number
          is_contacted: boolean | null
          message: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feel: Database["public"]["Enums"]["FEEDBACK_FEEL"]
          id?: number
          is_contacted?: boolean | null
          message?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          feel?: Database["public"]["Enums"]["FEEDBACK_FEEL"]
          id?: number
          is_contacted?: boolean | null
          message?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string
          description: string | null
          emoji: Json | null
          id: number
          image_url: string | null
          is_deleted: boolean | null
          is_locked: boolean | null
          is_published: boolean | null
          parent_uuid: string | null
          title: string | null
          updated_at: string
          user_id: string
          uuid: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          description?: string | null
          emoji?: Json | null
          id?: number
          image_url?: string | null
          is_deleted?: boolean | null
          is_locked?: boolean | null
          is_published?: boolean | null
          parent_uuid?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          uuid?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          description?: string | null
          emoji?: Json | null
          id?: number
          image_url?: string | null
          is_deleted?: boolean | null
          is_locked?: boolean | null
          is_published?: boolean | null
          parent_uuid?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          fullname: string | null
          id: number
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          fullname?: string | null
          id?: number
          user_id?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          fullname?: string | null
          id?: number
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      FEEDBACK_FEEL: "TERRIBLE" | "BAD" | "OKAY" | "GOOD" | "AMAZING"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

