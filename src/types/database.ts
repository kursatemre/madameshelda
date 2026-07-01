export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          category: string;
          price: number | null;
          images: string[];
          dimensions: string | null;
          materials: string | null;
          is_available: boolean;
          is_featured: boolean;
          variants: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          category: string;
          price?: number | null;
          images?: string[];
          dimensions?: string | null;
          materials?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          variants?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          category?: string;
          price?: number | null;
          images?: string[];
          dimensions?: string | null;
          materials?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          variants?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      workshops: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          date: string;
          duration_hours: number;
          capacity: number;
          filled: number;
          price: number;
          level: string;
          location: string | null;
          includes: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          date: string;
          duration_hours: number;
          capacity: number;
          filled?: number;
          price: number;
          level: string;
          location?: string | null;
          includes?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          date?: string;
          duration_hours?: number;
          capacity?: number;
          filled?: number;
          price?: number;
          level?: string;
          location?: string | null;
          includes?: string[] | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: {
          id: string;
          workshop_id: string;
          full_name: string;
          email: string;
          phone: string;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workshop_id: string;
          full_name: string;
          email: string;
          phone: string;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workshop_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          notes?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "registrations_workshop_id_fkey";
            columns: ["workshop_id"];
            isOneToOne: false;
            referencedRelation: "workshops";
            referencedColumns: ["id"];
          }
        ];
      };
      workshop_images: {
        Row: {
          id: string;
          url: string;
          caption: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          caption?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          caption?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      contact_requests: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          product_slug: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          product_slug?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          product_slug?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
