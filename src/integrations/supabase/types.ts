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
      project_likes: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_ip: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_ip: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_ratings: {
        Row: {
          created_at: string
          id: string
          project_id: string
          rating: number
          user_ip: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          rating: number
          user_ip: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          rating?: number
          user_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_ratings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_views: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_ip: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_ip: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_ip?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          builder_discord: string
          builder_name: string
          builder_twitter: string | null
          created_at: string
          description: string | null
          github_url: string | null
          id: string
          live_url: string | null
          mission: string
          name: string
          tags: string[] | null
          thumbnail: string | null
          twitter_bio: string | null
          twitter_data_fetched_at: string | null
          twitter_profile_picture: string | null
          twitter_verified: boolean | null
          updated_at: string
        }
        Insert: {
          builder_discord: string
          builder_name: string
          builder_twitter?: string | null
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          mission: string
          name: string
          tags?: string[] | null
          thumbnail?: string | null
          twitter_bio?: string | null
          twitter_data_fetched_at?: string | null
          twitter_profile_picture?: string | null
          twitter_verified?: boolean | null
          updated_at?: string
        }
        Update: {
          builder_discord?: string
          builder_name?: string
          builder_twitter?: string | null
          created_at?: string
          description?: string | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          mission?: string
          name?: string
          tags?: string[] | null
          thumbnail?: string | null
          twitter_bio?: string | null
          twitter_data_fetched_at?: string | null
          twitter_profile_picture?: string | null
          twitter_verified?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      url_verifications: {
        Row: {
          created_at: string
          id: string
          is_safe: boolean
          is_verified: boolean
          last_checked: string
          reason: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_safe?: boolean
          is_verified?: boolean
          last_checked?: string
          reason?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_safe?: boolean
          is_verified?: boolean
          last_checked?: string
          reason?: string | null
          url?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          id: number
          name: string
          description: string
          icon: string
          tier: number
          requirements: Json
          badge_color: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          icon: string
          tier: number
          requirements: Json
          badge_color?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          icon?: string
          tier?: number
          requirements?: Json
          badge_color?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_identifier: string
          user_type: string | null
          achievement_id: number
          earned_at: string
          progress: Json | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_identifier: string
          user_type?: string | null
          achievement_id: number
          earned_at?: string
          progress?: Json | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_identifier?: string
          user_type?: string | null
          achievement_id?: number
          earned_at?: string
          progress?: Json | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          }
        ]
      }
      builder_stats: {
        Row: {
          id: string
          builder_name: string
          builder_discord: string | null
          builder_twitter: string | null
          user_identifier: string
          total_projects: number | null
          projects_with_github: number | null
          projects_with_live_url: number | null
          projects_with_both: number | null
          total_likes: number | null
          total_views: number | null
          total_ratings: number | null
          average_rating: number | null
          missions_participated: string[] | null
          unique_mission_count: number | null
          high_rated_projects: number | null
          trending_projects: number | null
          winner_badges: number | null
          first_project_at: string | null
          last_project_at: string | null
          stats_updated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          builder_name: string
          builder_discord?: string | null
          builder_twitter?: string | null
          user_identifier: string
          total_projects?: number | null
          projects_with_github?: number | null
          projects_with_live_url?: number | null
          projects_with_both?: number | null
          total_likes?: number | null
          total_views?: number | null
          total_ratings?: number | null
          average_rating?: number | null
          missions_participated?: string[] | null
          unique_mission_count?: number | null
          high_rated_projects?: number | null
          trending_projects?: number | null
          winner_badges?: number | null
          first_project_at?: string | null
          last_project_at?: string | null
          stats_updated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          builder_name?: string
          builder_discord?: string | null
          builder_twitter?: string | null
          user_identifier?: string
          total_projects?: number | null
          projects_with_github?: number | null
          projects_with_live_url?: number | null
          projects_with_both?: number | null
          total_likes?: number | null
          total_views?: number | null
          total_ratings?: number | null
          average_rating?: number | null
          missions_participated?: string[] | null
          unique_mission_count?: number | null
          high_rated_projects?: number | null
          trending_projects?: number | null
          winner_badges?: number | null
          first_project_at?: string | null
          last_project_at?: string | null
          stats_updated_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_liked_project: {
        Args: { project_uuid: string; user_ip_hash: string }
        Returns: boolean
      }
      check_user_rated_project: {
        Args: { project_uuid: string; user_ip_hash: string }
        Returns: number
      }
      get_project_stats: {
        Args: { project_uuid: string }
        Returns: {
          avg_rating: number
          likes_count: number
          rating_count: number
          views_count: number
        }[]
      }
      submit_project_rating: {
        Args: {
          project_uuid: string
          rating_value: number
          user_ip_address: string
        }
        Returns: undefined
      }
      toggle_project_like: {
        Args: { project_uuid: string; user_ip_address: string }
        Returns: boolean
      }
      get_builder_achievements: {
        Args: { builder_identifier: string }
        Returns: {
          achievement_id: number
          name: string
          description: string
          icon: string
          tier: number
          badge_color: string
          earned_at: string
        }[]
      }
      has_achievement: {
        Args: { builder_identifier: string; achievement_name: string }
        Returns: boolean
      }
      award_achievement: {
        Args: {
          builder_identifier: string
          achievement_name: string
          user_type_param?: string
          metadata_param?: Json
        }
        Returns: boolean
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
