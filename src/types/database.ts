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
          stock_quantity: number | null;
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
          stock_quantity?: number | null;
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
          stock_quantity?: number | null;
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
          image_url: string | null;
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
          image_url?: string | null;
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
          image_url?: string | null;
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
      orders: {
        Row: {
          id: string;
          ref: string;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          note: string | null;
          items: Json;
          total: number;
          payment_method: string;
          status: string;
          coupon_code: string | null;
          discount_amount: number;
          user_id: string | null;
          review_reminder_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ref: string;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          note?: string | null;
          items: Json;
          total: number;
          payment_method: string;
          status?: string;
          coupon_code?: string | null;
          discount_amount?: number;
          user_id?: string | null;
          review_reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ref?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          note?: string | null;
          items?: Json;
          total?: number;
          payment_method?: string;
          status?: string;
          coupon_code?: string | null;
          discount_amount?: number;
          user_id?: string | null;
          review_reminder_sent_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_reviews: {
        Row: {
          id: string;
          product_id: string;
          customer_name: string;
          email: string;
          rating: number;
          comment: string;
          images: string[];
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          customer_name: string;
          email: string;
          rating: number;
          comment: string;
          images?: string[];
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          customer_name?: string;
          email?: string;
          rating?: number;
          comment?: string;
          images?: string[];
          is_approved?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: string;
          value: number;
          min_order_total: number;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type?: string;
          value: number;
          min_order_total?: number;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: string;
          value?: number;
          min_order_total?: number;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      cart_sessions: {
        Row: {
          id: string;
          session_id: string;
          email: string | null;
          items: Json;
          subtotal: number;
          reminder_sent_at: string | null;
          converted_at: string | null;
          last_activity_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          email?: string | null;
          items?: Json;
          subtotal?: number;
          reminder_sent_at?: string | null;
          converted_at?: string | null;
          last_activity_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          email?: string | null;
          items?: Json;
          subtotal?: number;
          reminder_sent_at?: string | null;
          converted_at?: string | null;
          last_activity_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
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
      admin_login_attempts: {
        Row: {
          id: string;
          ip: string;
          success: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ip: string;
          success: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          ip?: string;
          success?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
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
