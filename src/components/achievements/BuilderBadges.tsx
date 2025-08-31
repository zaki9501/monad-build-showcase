import React from 'react';
import { cn } from '@/lib/utils';
import { AchievementWithProgress } from '@/services/achievementService';
import BadgeIcon from './BadgeIcon';

interface BuilderBadgesProps {
  achievements: AchievementWithProgress[];
  builderName: string;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
  showEarnedOnly?: boolean;
  className?: string;
  onBadgeClick?: (achievement: AchievementWithProgress) => void;
}

const BuilderBadges: React.FC<BuilderBadgesProps> = ({
  achievements,
  builderName,
  maxDisplay = 5,
  size = 'sm',
  showProgress = false,
  showEarnedOnly = false,
  className,
  onBadgeClick
}) => {
  // Filter and sort achievements
  const filteredAchievements = achievements
    .filter(achievement => showEarnedOnly ? achievement.earned : true)
    .sort((a, b) => {
      // Earned badges first
      if (a.earned && !b.earned) return -1;
      if (!a.earned && b.earned) return 1;
      
      // Then by tier (lower tier = higher priority for display)
      if (a.tier !== b.tier) return a.tier - b.tier;
      
      // Finally by progress for unearned badges
      return (b.progress || 0) - (a.progress || 0);
    });

  const displayedAchievements = filteredAchievements.slice(0, maxDisplay);
  const remainingCount = Math.max(0, filteredAchievements.length - maxDisplay);
  const earnedCount = achievements.filter(a => a.earned).length;

  if (displayedAchievements.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1 relative z-10", className)}>
      {displayedAchievements.map((achievement) => (
        <BadgeIcon
          key={achievement.id}
          achievement={achievement}
          size={size}
          showProgress={showProgress}
          onClick={onBadgeClick ? () => onBadgeClick(achievement) : undefined}
        />
      ))}
      
      {/* Show count if there are more badges */}
      {remainingCount > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 text-gray-600 font-medium",
          size === 'sm' && "w-8 h-8 text-xs",
          size === 'md' && "w-10 h-10 text-sm", 
          size === 'lg' && "w-12 h-12 text-base",
          size === 'xl' && "w-16 h-16 text-lg"
        )}>
          +{remainingCount}
        </div>
      )}
      
      {/* Badge summary for earned count */}
      {earnedCount > 0 && size !== 'sm' && (
        <div className="ml-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{earnedCount}</span> badge{earnedCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default BuilderBadges;
