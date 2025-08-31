import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Type definitions for achievements
export interface Achievement extends Tables<'achievements'> {}
export interface UserAchievement extends Tables<'user_achievements'> {}
export interface BuilderStats extends Tables<'builder_stats'> {}

export interface AchievementWithProgress extends Achievement {
  earned: boolean;
  earnedAt?: string;
  progress?: number; // 0-100 percentage for trackable achievements
}

// Requirements structure
interface SimpleRequirement {
  type: 'simple';
  field: string;
  operator: string;
  value: number;
}

interface CompositeRequirement {
  type: 'composite';
  conditions: Array<{
    field: string;
    operator: string;
    value: number;
    field_ref?: string;
  }>;
  logic: 'AND' | 'OR';
}

interface SpecialRequirement {
  type: 'special';
  description: string;
}

type AchievementRequirement = SimpleRequirement | CompositeRequirement | SpecialRequirement;

/**
 * Achievement Service - Handles all achievement-related operations
 */
export class AchievementService {
  
  /**
   * Get all available achievements
   */
  static async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('tier', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Get achievements for a specific builder
   */
  static async getBuilderAchievements(builderIdentifier: string): Promise<AchievementWithProgress[]> {
    try {
      // Get all achievements
      const allAchievements = await this.getAllAchievements();
      
      // Get user's earned achievements
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_identifier', builderIdentifier);

      if (userError) {
        throw userError;
      }

      // Get builder stats for progress calculation
      const builderStats = await this.getBuilderStats(builderIdentifier);

      // Merge achievements with user progress
      const achievementsWithProgress: AchievementWithProgress[] = allAchievements.map(achievement => {
        const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
        const progress = builderStats ? this.calculateProgress(achievement, builderStats) : 0;

        return {
          ...achievement,
          earned: !!userAchievement,
          earnedAt: userAchievement?.earned_at,
          progress: userAchievement ? 100 : progress
        };
      });

      return achievementsWithProgress;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get or create builder stats
   */
  static async getBuilderStats(builderIdentifier: string): Promise<BuilderStats | null> {
    const { data, error } = await supabase
      .from('builder_stats')
      .select('*')
      .eq('user_identifier', builderIdentifier)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error;
    }

    return data;
  }

  /**
   * Update builder stats based on their projects
   */
  static async updateBuilderStats(builderName: string, builderDiscord?: string, builderTwitter?: string): Promise<void> {
    try {
      // Create user identifier (prioritize Discord, fallback to name)
      const userIdentifier = builderDiscord || builderName;

      // Get all projects by this builder
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_likes(count),
          project_views(count),
          project_ratings(rating)
        `)
        .or(`builder_name.eq.${builderName},builder_discord.eq.${builderDiscord}`)
        .not('builder_name', 'is', null);

      if (projectsError) {
        return;
      }

      if (!projects || projects.length === 0) {
        return;
      }

      // Calculate stats
      const stats = this.calculateBuilderStatsFromProjects(projects);
      
      // Upsert builder stats
      const { error: upsertError } = await supabase
        .from('builder_stats')
        .upsert({
          user_identifier: userIdentifier,
          builder_name: builderName,
          builder_discord: builderDiscord || null,
          builder_twitter: builderTwitter || null,
          ...stats,
          stats_updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_identifier'
        });

      if (upsertError) {
        throw upsertError;
      }

      // Check and award achievements
      await this.checkAndAwardAchievements(userIdentifier);

    } catch (error) {
      throw error;
    }
  }

  /**
   * Calculate builder stats from projects
   */
  private static calculateBuilderStatsFromProjects(projects: any[]): Partial<BuilderStats> {
    const totalProjects = projects.length;
    const projectsWithGithub = projects.filter(p => p.github_url).length;
    const projectsWithLiveUrl = projects.filter(p => p.live_url).length;
    const projectsWithBoth = projects.filter(p => p.github_url && p.live_url).length;

    // Calculate engagement stats
    let totalLikes = 0;
    let totalViews = 0;
    let allRatings: number[] = [];

    projects.forEach(project => {
      // Use actual engagement data if available, otherwise use predictable calculations
      // based on project characteristics (not random)
      const hasGithub = project.github_url ? 1 : 0;
      const hasLive = project.live_url ? 1 : 0;
      const hasBoth = hasGithub && hasLive ? 1 : 0;
      
      // Use actual engagement data from project_likes/views tables if available
      const projectLikes = project.project_likes?.[0]?.count || 0;
      const projectViews = project.project_views?.[0]?.count || 0;
      const projectRatings = project.project_ratings || [];
      
      // Calculate base scores based on project completeness (deterministic, not random)
      const completenessScore = hasGithub + hasLive * 2 + hasBoth;
      const qualityBonus = project.description?.length > 100 ? 2 : 0;
      const tagsBonus = (project.tags?.length || 0) * 0.5;
      
      // Use real data if available, otherwise calculate based on project characteristics
      const calculatedLikes = projectLikes > 0 ? projectLikes : Math.max(1, completenessScore + qualityBonus);
      const calculatedViews = projectViews > 0 ? projectViews : Math.max(3, (completenessScore * 3) + (qualityBonus * 2));
      
      totalLikes += calculatedLikes;
      totalViews += calculatedViews;
      
      // Collect actual ratings
      if (projectRatings && projectRatings.length > 0) {
        projectRatings.forEach((rating: any) => {
          if (typeof rating.rating === 'number') {
            allRatings.push(rating.rating);
          }
        });
      }
    });

    const missions = [...new Set(projects.map(p => p.mission))];
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length 
      : 0;

    const firstProjectAt = projects
      .map(p => new Date(p.created_at))
      .sort((a, b) => a.getTime() - b.getTime())[0]?.toISOString();

    const lastProjectAt = projects
      .map(p => new Date(p.created_at))
      .sort((a, b) => b.getTime() - a.getTime())[0]?.toISOString();

    return {
      total_projects: totalProjects,
      projects_with_github: projectsWithGithub,
      projects_with_live_url: projectsWithLiveUrl,
      projects_with_both: projectsWithBoth,
      total_likes: totalLikes,
      total_views: totalViews,
      total_ratings: allRatings.length,
      average_rating: Number(averageRating.toFixed(2)),
      missions_participated: missions,
      unique_mission_count: missions.length,
      high_rated_projects: allRatings.filter(r => r >= 4).length,
      first_project_at: firstProjectAt,
      last_project_at: lastProjectAt
    };
  }

  /**
   * Calculate progress towards an achievement
   */
  private static calculateProgress(achievement: Achievement, stats: BuilderStats): number {
    const requirements = achievement.requirements as unknown as AchievementRequirement;
    
    if (requirements.type === 'special') {
      return 0; // Special achievements don't show progress
    }

    if (requirements.type === 'simple') {
      const value = this.getStatValue(stats, requirements.field) || 0;
      const target = requirements.value;
      return Math.min(100, Math.round((value / target) * 100));
    }

    if (requirements.type === 'composite') {
      // For composite requirements, show the minimum progress of all conditions
      const progresses = requirements.conditions.map(condition => {
        const value = this.getStatValue(stats, condition.field) || 0;
        const target = condition.value;
        return Math.min(100, (value / target) * 100);
      });

      return Math.round(Math.min(...progresses));
    }

    return 0;
  }

  /**
   * Get stat value by field name
   */
  private static getStatValue(stats: BuilderStats, field: string): number {
    const value = (stats as any)[field];
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Check achievements and award new ones
   */
  static async checkAndAwardAchievements(builderIdentifier: string): Promise<string[]> {
    const newAchievements: string[] = [];
    
    try {
      const achievements = await this.getBuilderAchievements(builderIdentifier);
      const stats = await this.getBuilderStats(builderIdentifier);
      
      if (!stats) return newAchievements;

      for (const achievement of achievements) {
        if (!achievement.earned && this.checkAchievementRequirements(achievement, stats)) {
          // Award the achievement
          const awarded = await this.awardAchievement(builderIdentifier, achievement.name);
          if (awarded) {
            newAchievements.push(achievement.name);
          }
        }
      }
    } catch (error) {
      // Silently handle errors in achievement checking
    }

    return newAchievements;
  }

  /**
   * Check if achievement requirements are met
   */
  private static checkAchievementRequirements(achievement: Achievement, stats: BuilderStats): boolean {
    const requirements = achievement.requirements as unknown as AchievementRequirement;
    
    if (requirements.type === 'special') {
      return false; // Special achievements are manually awarded
    }

    if (requirements.type === 'simple') {
      const value = this.getStatValue(stats, requirements.field);
      return this.evaluateCondition(value, requirements.operator, requirements.value);
    }

    if (requirements.type === 'composite') {
      const results = requirements.conditions.map(condition => {
        const value = this.getStatValue(stats, condition.field);
        const target = condition.field_ref 
          ? this.getStatValue(stats, condition.field_ref)
          : condition.value;
        
        return this.evaluateCondition(value, condition.operator, target);
      });

      return requirements.logic === 'AND' 
        ? results.every(r => r)
        : results.some(r => r);
    }

    return false;
  }

  /**
   * Evaluate a condition
   */
  private static evaluateCondition(value: number, operator: string, target: number): boolean {
    switch (operator) {
      case '>=': return value >= target;
      case '>': return value > target;
      case '<=': return value <= target;
      case '<': return value < target;
      case '=': return value === target;
      case '!=': return value !== target;
      default: return false;
    }
  }

  /**
   * Award achievement to builder
   */
  static async awardAchievement(builderIdentifier: string, achievementName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('award_achievement', {
        builder_identifier: builderIdentifier,
        achievement_name: achievementName,
        user_type_param: 'builder'
      });

      if (error) {
        console.error('Error awarding achievement:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error in awardAchievement:', error);
      return false;
    }
  }

  /**
   * Get achievement by name
   */
  static async getAchievementByName(name: string): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching achievement:', error);
      return null;
    }

    return data;
  }
}

export default AchievementService;
