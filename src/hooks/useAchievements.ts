import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AchievementService, { Achievement, AchievementWithProgress, BuilderStats } from '@/services/achievementService';

export interface UseAchievementsReturn {
  // Data
  achievements: AchievementWithProgress[];
  allAchievements: Achievement[];
  builderStats: BuilderStats | null;
  
  // Loading states
  loading: boolean;
  awarding: boolean;
  updating: boolean;
  
  // Methods
  refetchAchievements: () => Promise<void>;
  updateBuilderStats: (builderName: string, builderDiscord?: string, builderTwitter?: string) => Promise<void>;
  awardManualAchievement: (builderIdentifier: string, achievementName: string) => Promise<boolean>;
  
  // Computed values
  earnedCount: number;
  totalCount: number;
  progress: number;
  recentAchievements: AchievementWithProgress[];
}

/**
 * Hook for managing builder achievements
 */
export function useAchievements(builderIdentifier?: string): UseAchievementsReturn {
  const [achievements, setAchievements] = useState<AchievementWithProgress[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [builderStats, setBuilderStats] = useState<BuilderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [awarding, setAwarding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  /**
   * Fetch achievements for builder
   */
  const fetchAchievements = async (identifier?: string) => {
    if (!identifier) return;
    
    try {
      setLoading(true);
      const [builderAchievements, stats] = await Promise.all([
        AchievementService.getBuilderAchievements(identifier),
        AchievementService.getBuilderStats(identifier)
      ]);
      
      setAchievements(builderAchievements);
      setBuilderStats(stats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load achievements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all available achievements
   */
  const fetchAllAchievements = async () => {
    try {
      const all = await AchievementService.getAllAchievements();
      setAllAchievements(all);
    } catch (error) {
      // Silently fail - not critical
    }
  };

  /**
   * Update builder stats and check for new achievements
   */
  const updateBuilderStats = async (builderName: string, builderDiscord?: string, builderTwitter?: string) => {
    try {
      setUpdating(true);
      
      // Update stats
      await AchievementService.updateBuilderStats(builderName, builderDiscord, builderTwitter);
      
      // Refresh achievements if we have an identifier
      const identifier = builderDiscord || builderName;
      if (identifier) {
        await fetchAchievements(identifier);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update builder stats. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Award manual achievement (for admin use)
   */
  const awardManualAchievement = async (identifier: string, achievementName: string): Promise<boolean> => {
    try {
      setAwarding(true);
      
      const success = await AchievementService.awardAchievement(identifier, achievementName);
      
      if (success) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `Congratulations! You earned the "${achievementName}" badge!`,
        });
        
        // Refresh achievements
        await fetchAchievements(identifier);
        
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to award achievement. It may already be earned.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to award achievement. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setAwarding(false);
    }
  };

  /**
   * Refetch achievements
   */
  const refetchAchievements = async () => {
    if (builderIdentifier) {
      await fetchAchievements(builderIdentifier);
    }
    await fetchAllAchievements();
  };

  // Load data on mount and when identifier changes
  useEffect(() => {
    fetchAllAchievements();
    if (builderIdentifier) {
      fetchAchievements(builderIdentifier);
    }
  }, [builderIdentifier]);

  // Computed values
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;
  const recentAchievements = achievements
    .filter(a => a.earned && a.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 3);

  return {
    // Data
    achievements,
    allAchievements,
    builderStats,
    
    // Loading states
    loading,
    awarding,
    updating,
    
    // Methods
    refetchAchievements,
    updateBuilderStats,
    awardManualAchievement,
    
    // Computed values
    earnedCount,
    totalCount,
    progress,
    recentAchievements
  };
}

