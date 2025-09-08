import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AchievementWithProgress } from '@/services/achievementService';

interface BadgeIconProps {
  achievement: AchievementWithProgress;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
  showTitle?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

const tierColors = {
  1: 'border-green-400 bg-green-50 text-green-800', // Participation - Green
  2: 'border-blue-400 bg-blue-50 text-blue-800',   // Engagement - Blue  
  3: 'border-purple-400 bg-purple-50 text-purple-800', // Mastery - Purple
  4: 'border-yellow-400 bg-yellow-50 text-yellow-800'  // Special - Gold
};

const earnedTierColors = {
  1: 'border-green-500 bg-green-100 text-green-900 shadow-sm',
  2: 'border-blue-500 bg-blue-100 text-blue-900 shadow-sm', 
  3: 'border-purple-500 bg-purple-100 text-purple-900 shadow-sm',
  4: 'border-yellow-500 bg-yellow-100 text-yellow-900 shadow-sm shadow-yellow-200'
};

const BadgeIcon: React.FC<BadgeIconProps> = ({
  achievement,
  size = 'md',
  showProgress = false,
  showTitle = false,
  className,
  onClick
}) => {
  const isEarned = achievement.earned;
  const progress = achievement.progress || 0;
  const tier = achievement.tier as keyof typeof tierColors;
  
  const colorClass = isEarned 
    ? earnedTierColors[tier] || earnedTierColors[1]
    : tierColors[tier] || tierColors[1];

  const badgeContent = (
    <div className={cn("relative group z-20", className)}>
      <div
        className={cn(
          "relative rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105",
          sizeClasses[size],
          colorClass,
          !isEarned && "grayscale-[0.7] opacity-60",
          onClick && "hover:shadow-md"
        )}
        onClick={onClick}
      >
        <span className="select-none" role="img" aria-label={achievement.name}>
          {achievement.icon}
        </span>
        
        {/* Earned indicator */}
        {isEarned && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
        )}
        
        {/* Tier indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white text-xs font-bold flex items-center justify-center",
          tier === 1 && "bg-green-500 text-white",
          tier === 2 && "bg-blue-500 text-white",
          tier === 3 && "bg-purple-500 text-white", 
          tier === 4 && "bg-yellow-500 text-white"
        )}>
          {tier}
        </div>
      </div>

      {/* Progress bar for unearned achievements */}
      {showProgress && !isEarned && progress > 0 && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-[60px]">
          <Progress value={progress} className="h-1 bg-gray-200" />
        </div>
      )}

      {/* Title below badge */}
      {showTitle && (
        <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className={cn(
            "text-xs font-medium",
            isEarned ? "text-gray-900" : "text-gray-500"
          )}>
            {achievement.name}
          </span>
        </div>
      )}
    </div>
  );

  // Wrap with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs z-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{achievement.icon}</span>
              <div>
                <p className="font-semibold">{achievement.name}</p>
                <Badge variant="outline" className="text-xs">
                  Tier {achievement.tier}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {achievement.description}
            </p>

            {isEarned ? (
              <div className="flex items-center gap-1 text-green-600">
                <span className="text-sm">✓ Earned</span>
                {achievement.earnedAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ) : (
              progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeIcon;
