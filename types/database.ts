export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          birth_date: string | null;
          height_cm: number | null;
          biological_sex: string | null;
          goal: string | null;
          calorie_target: number | null;
          protein_target: number | null;
          carbohydrate_target: number | null;
          fat_target: number | null;
          fiber_target: number | null;
          water_target: number | null;
          weight_unit: string;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      foods: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          brand: string | null;
          category: string;
          reference_amount: number;
          reference_unit: string;
          calories: number;
          protein: number;
          carbohydrates: number;
          fat: number;
          fiber: number;
          sodium: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["foods"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["foods"]["Row"]>;
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          meal_date: string;
          meal_time: string;
          meal_type: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["meals"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["meals"]["Row"]>;
        Relationships: [];
      };
      meal_items: {
        Row: {
          id: string;
          meal_id: string;
          food_id: string | null;
          consumed_amount: number;
          consumed_unit: string;
          calculated_calories: number;
          calculated_protein: number;
          calculated_carbohydrates: number;
          calculated_fat: number;
          calculated_fiber: number;
          calculated_sodium: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["meal_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["meal_items"]["Row"]>;
        Relationships: [];
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          weight_kg: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["weight_entries"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["weight_entries"]["Row"]>;
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_users"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Row"]>;
        Relationships: [];
      };
      client_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string;
          objective: string;
          birth_date: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          target_weight_kg: number | null;
          biological_sex: string | null;
          activity_level: string;
          meals_per_day: number;
          routine: string | null;
          food_likes: string | null;
          food_dislikes: string | null;
          restrictions: string | null;
          health_notes: string | null;
          training_goal: string | null;
          training_experience: string | null;
          training_location: string | null;
          training_days_per_week: number | null;
          available_equipment: string | null;
          admin_notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["client_profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["client_profiles"]["Row"]>;
        Relationships: [];
      };
      coaching_plans: {
        Row: {
          id: string;
          user_id: string;
          created_by: string | null;
          title: string;
          status: string;
          source: string;
          nutrition_summary: string;
          workout_summary: string;
          meals: Json;
          workouts: Json;
          notes: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["coaching_plans"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["coaching_plans"]["Row"]>;
        Relationships: [];
      };
      public_leads: {
        Row: {
          id: string;
          public_token: string;
          full_name: string;
          email: string;
          whatsapp: string | null;
          objective: string;
          birth_date: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          target_weight_kg: number | null;
          biological_sex: string | null;
          activity_level: string;
          meals_per_day: number;
          routine: string | null;
          food_likes: string | null;
          food_dislikes: string | null;
          restrictions: string | null;
          health_notes: string | null;
          training_goal: string | null;
          training_experience: string | null;
          training_location: string | null;
          training_days_per_week: number | null;
          available_equipment: string | null;
          selected_plan: string | null;
          checkout_status: string;
          payment_provider: string | null;
          payment_reference: string | null;
          converted_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["public_leads"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["public_leads"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
