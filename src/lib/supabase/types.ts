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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      datasets: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "datasets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      uploaded_files: {
        Row: {
          id: string
          dataset_id: string | null
          user_id: string | null
          file_name: string
          file_size: number
          file_type: string
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          dataset_id?: string | null
          user_id?: string | null
          file_name: string
          file_size: number
          file_type: string
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          dataset_id?: string | null
          user_id?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          storage_path?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_dataset_id_fkey"
            columns: ["dataset_id"]
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploaded_files_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      dashboards: {
        Row: {
          id: string
          user_id: string | null
          title: string
          layout: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          layout?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          layout?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string | null
          role: string
          content: string
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          role: string
          content: string
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          role?: string
          content?: string
          session_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
