export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          color?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense'
          amount_cents: number
          description: string
          category_id: string | null
          occurred_on: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense'
          amount_cents: number
          description?: string
          category_id?: string | null
          occurred_on?: string
          created_at?: string
        }
        Update: {
          type?: 'income' | 'expense'
          amount_cents?: number
          description?: string
          category_id?: string | null
          occurred_on?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_amount_cents: number
          saved_amount_cents: number
          deadline: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_amount_cents: number
          saved_amount_cents?: number
          deadline?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          target_amount_cents?: number
          saved_amount_cents?: number
          deadline?: string | null
        }
      }
      credit_cards: {
        Row: {
          id: string
          user_id: string
          name: string
          limit_cents: number
          balance_cents: number
          closing_day: number
          due_day: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          limit_cents: number
          balance_cents?: number
          closing_day: number
          due_day: number
          created_at?: string
        }
        Update: {
          name?: string
          limit_cents?: number
          balance_cents?: number
          closing_day?: number
          due_day?: number
        }
      }
    }
  }
}
