// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number: string | null
          agency: string | null
          balance: number | null
          color: string | null
          connected: boolean | null
          created_at: string | null
          id: string
          name: string
          responsible_profile_id: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          agency?: string | null
          balance?: number | null
          color?: string | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          responsible_profile_id?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          agency?: string | null
          balance?: number | null
          color?: string | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          responsible_profile_id?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_responsible_profile_id_fkey"
            columns: ["responsible_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          account_id: string | null
          closing_day: number | null
          color: string | null
          created_at: string | null
          due_day: number | null
          id: string
          is_archived: boolean | null
          limit: number | null
          name: string
          profile_id: string | null
          user_id: string
        }
        Insert: {
          account_id?: string | null
          closing_day?: number | null
          color?: string | null
          created_at?: string | null
          due_day?: number | null
          id?: string
          is_archived?: boolean | null
          limit?: number | null
          name: string
          profile_id?: string | null
          user_id: string
        }
        Update: {
          account_id?: string | null
          closing_day?: number | null
          color?: string | null
          created_at?: string | null
          due_day?: number | null
          id?: string
          is_archived?: boolean | null
          limit?: number | null
          name?: string
          profile_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          color: string
          created_at: string | null
          current_value: number | null
          icon: string | null
          id: string
          monthly_contribution: number | null
          name: string
          target_date: string | null
          target_value: number
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          current_value?: number | null
          icon?: string | null
          id?: string
          monthly_contribution?: number | null
          name: string
          target_date?: string | null
          target_value: number
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          current_value?: number | null
          icon?: string | null
          id?: string
          monthly_contribution?: number | null
          name?: string
          target_date?: string | null
          target_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hotmart_events: {
        Row: {
          id: string
          payload: Json
          received_at: string | null
        }
        Insert: {
          id?: string
          payload: Json
          received_at?: string | null
        }
        Update: {
          id?: string
          payload?: Json
          received_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          family_id: string
          id: string
          name: string
          profile_id: string | null
          role: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          family_id: string
          id?: string
          name: string
          profile_id?: string | null
          role?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          family_id?: string
          id?: string
          name?: string
          profile_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          plan: string
          profile_type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          plan?: string
          profile_type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          plan?: string
          profile_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account: string | null
          amount: number
          asset_name: string | null
          bank_broker: string | null
          card_id: string | null
          category: string
          date: string
          description: string
          expense_type: string | null
          goal_id: string | null
          has_attachment: boolean | null
          id: string
          installments: number | null
          profile: string | null
          recurrence: string | null
          type: string
          user_id: string
        }
        Insert: {
          account?: string | null
          amount: number
          asset_name?: string | null
          bank_broker?: string | null
          card_id?: string | null
          category: string
          date: string
          description: string
          expense_type?: string | null
          goal_id?: string | null
          has_attachment?: boolean | null
          id?: string
          installments?: number | null
          profile?: string | null
          recurrence?: string | null
          type: string
          user_id: string
        }
        Update: {
          account?: string | null
          amount?: number
          asset_name?: string | null
          bank_broker?: string | null
          card_id?: string | null
          category?: string
          date?: string
          description?: string
          expense_type?: string | null
          goal_id?: string | null
          has_attachment?: boolean | null
          id?: string
          installments?: number | null
          profile?: string | null
          recurrence?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_user: {
        Args: {
          full_name: string
          new_email: string
          new_password: string
          plan?: string
          profile_type?: string
        }
        Returns: string
      }
      admin_delete_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      admin_update_user_password: {
        Args: { new_password: string; target_user_id: string }
        Returns: undefined
      }
      is_team_admin: { Args: never; Returns: boolean }
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


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: accounts
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   name: text (not null)
//   type: text (nullable)
//   balance: numeric (nullable, default: 0)
//   agency: text (nullable)
//   account_number: text (nullable)
//   color: text (nullable, default: '#016ad9'::text)
//   connected: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   responsible_profile_id: uuid (nullable)
// Table: cards
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   profile_id: uuid (nullable)
//   name: text (not null)
//   limit: numeric (nullable, default: 0)
//   closing_day: integer (nullable)
//   due_day: integer (nullable)
//   account_id: uuid (nullable)
//   color: text (nullable, default: '#000000'::text)
//   is_archived: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: categories
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   name: text (not null)
//   type: text (not null)
//   icon: text (nullable, default: 'CircleDashed'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: families
//   id: uuid (not null, default: gen_random_uuid())
//   created_at: timestamp with time zone (nullable, default: now())
//   name: text (not null)
//   owner_id: uuid (not null)
// Table: goals
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   name: text (not null)
//   target_value: numeric (not null)
//   current_value: numeric (nullable, default: 0)
//   monthly_contribution: numeric (nullable, default: 0)
//   target_date: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   icon: text (nullable, default: 'Target'::text)
//   color: text (not null, default: '#016ad9'::text)
// Table: hotmart_events
//   id: uuid (not null, default: gen_random_uuid())
//   payload: jsonb (not null)
//   received_at: timestamp with time zone (nullable, default: now())
// Table: members
//   id: uuid (not null, default: gen_random_uuid())
//   family_id: uuid (not null)
//   profile_id: uuid (nullable)
//   name: text (not null)
//   email: text (nullable)
//   role: text (not null, default: 'member'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   birth_date: date (nullable)
// Table: profiles
//   id: uuid (not null)
//   full_name: text (nullable)
//   updated_at: timestamp with time zone (nullable, default: now())
//   email: text (nullable)
//   avatar_url: text (nullable)
//   plan: text (not null, default: 'solo'::text)
//   birth_date: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   profile_type: text (nullable, default: 'personal'::text)
// Table: transactions
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   description: text (not null)
//   amount: numeric (not null)
//   type: text (not null)
//   category: text (not null)
//   date: timestamp with time zone (not null)
//   expense_type: text (nullable)
//   account: text (nullable)
//   card_id: text (nullable)
//   recurrence: text (nullable)
//   has_attachment: boolean (nullable, default: false)
//   profile: text (nullable)
//   goal_id: uuid (nullable)
//   bank_broker: text (nullable)
//   asset_name: text (nullable)
//   installments: integer (nullable)

// --- CONSTRAINTS ---
// Table: accounts
//   PRIMARY KEY accounts_pkey: PRIMARY KEY (id)
//   FOREIGN KEY accounts_responsible_profile_id_fkey: FOREIGN KEY (responsible_profile_id) REFERENCES profiles(id) ON DELETE SET NULL
//   FOREIGN KEY accounts_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: cards
//   FOREIGN KEY cards_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
//   CHECK cards_closing_day_check: CHECK (((closing_day >= 1) AND (closing_day <= 31)))
//   CHECK cards_due_day_check: CHECK (((due_day >= 1) AND (due_day <= 31)))
//   PRIMARY KEY cards_pkey: PRIMARY KEY (id)
//   FOREIGN KEY cards_profile_id_fkey: FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
//   FOREIGN KEY cards_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: categories
//   PRIMARY KEY categories_pkey: PRIMARY KEY (id)
//   FOREIGN KEY categories_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: families
//   FOREIGN KEY families_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY families_pkey: PRIMARY KEY (id)
// Table: goals
//   PRIMARY KEY goals_pkey: PRIMARY KEY (id)
//   FOREIGN KEY goals_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: hotmart_events
//   PRIMARY KEY hotmart_events_pkey: PRIMARY KEY (id)
// Table: members
//   FOREIGN KEY members_family_id_fkey: FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
//   PRIMARY KEY members_pkey: PRIMARY KEY (id)
//   FOREIGN KEY members_profile_id_fkey: FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: transactions
//   FOREIGN KEY transactions_goal_id_fkey: FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
//   PRIMARY KEY transactions_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transactions_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts
//   Policy "Users can manage own accounts" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: cards
//   Policy "Users can manage own cards" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: categories
//   Policy "Users can delete own categories" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can insert own categories" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can update own categories" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can view own categories" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: families
//   Policy "Admin and Team can view all families" (SELECT, PERMISSIVE) roles={public}
//     USING: (((auth.jwt() ->> 'email'::text) = 'fhbcyberguard@gmail.com'::text) OR is_team_admin())
//   Policy "Users can insert own families" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = owner_id)
//   Policy "Users can update own families" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = owner_id)
//   Policy "Users can view own families" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = owner_id)
// Table: goals
//   Policy "Users can delete own goals" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can insert own goals" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can update own goals" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can view own goals" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
// Table: members
//   Policy "Users can manage members of their families" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM families f   WHERE ((f.id = members.family_id) AND (f.owner_id = auth.uid()))))
// Table: profiles
//   Policy "Admin and Team can view all profiles" (SELECT, PERMISSIVE) roles={public}
//     USING: (((auth.jwt() ->> 'email'::text) = 'fhbcyberguard@gmail.com'::text) OR is_team_admin())
//   Policy "Master admin can update all profiles" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((auth.jwt() ->> 'email'::text) = 'fhbcyberguard@gmail.com'::text)
//   Policy "Team Admins can update family profiles" (UPDATE, PERMISSIVE) roles={public}
//     USING: (is_team_admin() AND (EXISTS ( SELECT 1    FROM (members m      JOIN families f ON ((m.family_id = f.id)))   WHERE ((m.profile_id = profiles.id) AND (f.owner_id = auth.uid())))))
//   Policy "Users can insert own profile" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = id)
//   Policy "Users can update own profile" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
//   Policy "Users can view own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: transactions
//   Policy "Users can delete own transactions" (DELETE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can insert own transactions" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() = user_id)
//   Policy "Users can update own transactions" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)
//   Policy "Users can view own transactions" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = user_id)

// --- DATABASE FUNCTIONS ---
// FUNCTION admin_create_user(text, text, text, text, text)
//   CREATE OR REPLACE FUNCTION public.admin_create_user(new_email text, new_password text, full_name text, plan text DEFAULT 'solo'::text, profile_type text DEFAULT 'personal'::text)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     caller_email TEXT;
//     new_user_id UUID;
//     assigned_plan TEXT;
//   BEGIN
//     BEGIN
//       caller_email := current_setting('request.jwt.claims', true)::json->>'email';
//     EXCEPTION WHEN OTHERS THEN
//       caller_email := '';
//     END;
//   
//     IF COALESCE(caller_email, '') != 'fhbcyberguard@gmail.com' THEN
//       RAISE EXCEPTION 'Unauthorized';
//     END IF;
//   
//     assigned_plan := plan;
//     IF assigned_plan = 'master_team' AND new_email != 'fhbcyberguard@gmail.com' AND COALESCE(caller_email, '') != 'fhbcyberguard@gmail.com' THEN
//       assigned_plan := 'solo';
//     END IF;
//   
//     new_user_id := gen_random_uuid();
//   
//     INSERT INTO auth.users (
//       id, instance_id, email, encrypted_password, email_confirmed_at,
//       created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
//       is_super_admin, role, aud,
//       confirmation_token, recovery_token, email_change_token_new,
//       email_change, email_change_token_current,
//       phone, phone_change, phone_change_token, reauthentication_token
//     ) VALUES (
//       new_user_id,
//       '00000000-0000-0000-0000-000000000000',
//       new_email,
//       crypt(new_password, gen_salt('bf')),
//       NOW(), NOW(), NOW(),
//       '{"provider": "email", "providers": ["email"]}',
//       json_build_object('full_name', full_name, 'plan', assigned_plan, 'profile_type', profile_type),
//       false, 'authenticated', 'authenticated',
//       '', '', '', '', '',
//       NULL, '', '', ''
//     );
//   
//     RETURN new_user_id;
//   END;
//   $function$
//   
// FUNCTION admin_delete_user(uuid)
//   CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     caller_email TEXT;
//   BEGIN
//     -- Verify the caller is the Master Admin or a Team Admin
//     caller_email := current_setting('request.jwt.claims', true)::json->>'email';
//     IF caller_email != 'fhbcyberguard@gmail.com' AND NOT public.is_team_admin() THEN
//       RAISE EXCEPTION 'Unauthorized';
//     END IF;
//   
//     -- Delete from auth.users (cascades to public tables)
//     DELETE FROM auth.users WHERE id = target_user_id;
//   END;
//   $function$
//   
// FUNCTION admin_update_user_password(uuid, text)
//   CREATE OR REPLACE FUNCTION public.admin_update_user_password(target_user_id uuid, new_password text)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public', 'extensions'
//   AS $function$
//   DECLARE
//     caller_email TEXT;
//   BEGIN
//     -- Verify the caller is the Master Admin
//     caller_email := current_setting('request.jwt.claims', true)::json->>'email';
//     IF caller_email != 'fhbcyberguard@gmail.com' THEN
//       RAISE EXCEPTION 'Unauthorized';
//     END IF;
//   
//     -- Update password in auth.users
//     UPDATE auth.users
//     SET encrypted_password = crypt(new_password, gen_salt('bf')),
//         updated_at = NOW()
//     WHERE id = target_user_id;
//   END;
//   $function$
//   
// FUNCTION enforce_master_team_plan_restriction()
//   CREATE OR REPLACE FUNCTION public.enforce_master_team_plan_restriction()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     caller_email TEXT;
//   BEGIN
//     BEGIN
//       caller_email := current_setting('request.jwt.claims', true)::json->>'email';
//     EXCEPTION WHEN OTHERS THEN
//       caller_email := '';
//     END;
//   
//     IF NEW.plan = 'master_team' AND NEW.email != 'fhbcyberguard@gmail.com' AND COALESCE(caller_email, '') != 'fhbcyberguard@gmail.com' THEN
//       NEW.plan := 'solo';
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION enforce_team_plan_restriction()
//   CREATE OR REPLACE FUNCTION public.enforce_team_plan_restriction()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     caller_email TEXT;
//   BEGIN
//     BEGIN
//       caller_email := current_setting('request.jwt.claims', true)::json->>'email';
//     EXCEPTION WHEN OTHERS THEN
//       caller_email := '';
//     END;
//   
//     IF NEW.plan = 'team' AND NEW.email != 'fhbcyberguard@gmail.com' AND COALESCE(caller_email, '') != 'fhbcyberguard@gmail.com' THEN
//       NEW.plan := 'basic';
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     new_family_id UUID;
//     user_name TEXT;
//     assigned_plan TEXT;
//     assigned_type TEXT;
//     caller_email TEXT;
//   BEGIN
//     user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
//     assigned_plan := COALESCE(NEW.raw_user_meta_data->>'plan', 'solo');
//     assigned_type := COALESCE(NEW.raw_user_meta_data->>'profile_type', 'personal');
//   
//     BEGIN
//       caller_email := current_setting('request.jwt.claims', true)::json->>'email';
//     EXCEPTION WHEN OTHERS THEN
//       caller_email := '';
//     END;
//   
//     IF assigned_plan = 'master_team' AND NEW.email != 'fhbcyberguard@gmail.com' AND COALESCE(caller_email, '') != 'fhbcyberguard@gmail.com' THEN
//       assigned_plan := 'solo';
//     END IF;
//   
//     INSERT INTO public.profiles (id, full_name, email, plan, profile_type, updated_at)
//     VALUES (
//       NEW.id,
//       user_name,
//       NEW.email,
//       assigned_plan,
//       assigned_type,
//       NOW()
//     )
//     ON CONFLICT (id) DO UPDATE SET 
//       full_name = EXCLUDED.full_name,
//       email = EXCLUDED.email,
//       plan = EXCLUDED.plan,
//       profile_type = EXCLUDED.profile_type;
//   
//     IF NOT EXISTS (SELECT 1 FROM public.families WHERE owner_id = NEW.id) THEN
//         INSERT INTO public.families (name, owner_id)
//         VALUES ('Família ' || user_name, NEW.id)
//         RETURNING id INTO new_family_id;
//   
//         INSERT INTO public.members (family_id, profile_id, name, email, role)
//         VALUES (new_family_id, NEW.id, user_name, NEW.email, 'admin');
//     END IF;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION is_team_admin()
//   CREATE OR REPLACE FUNCTION public.is_team_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan = 'team'
//     );
//   $function$
//   
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: profiles
//   on_profile_plan_update: CREATE TRIGGER on_profile_plan_update BEFORE UPDATE OF plan ON public.profiles FOR EACH ROW EXECUTE FUNCTION enforce_master_team_plan_restriction()

