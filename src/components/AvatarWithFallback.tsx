
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTwitterProfile } from '@/hooks/useTwitterProfile';

interface AvatarWithFallbackProps {
  builderName: string;
  twitterUrl?: string;
  discordUsername?: string;
  className?: string;
  projectId?: string;
}

export const AvatarWithFallback = ({ 
  builderName, 
  twitterUrl, 
  discordUsername,
  className,
  projectId
}: AvatarWithFallbackProps) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const { profile: twitterProfile } = useTwitterProfile(twitterUrl, projectId);
  
  // Extract Twitter username from URL for unavatar fallback
  const getTwitterUsername = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
    return match ? match[1] : null;
  };

  const twitterUsername = getTwitterUsername(twitterUrl);
  
  // Create multiple avatar sources with fallbacks, prioritizing real Twitter profile picture
  const avatarSources = [
    // Primary: Real Twitter profile picture from API
    twitterProfile.profilePicture,
    // Secondary: Twitter via unavatar.io (fallback)
    twitterUsername ? `https://unavatar.io/twitter/${twitterUsername}` : null,
    // Tertiary: GitHub style avatar with name
    `https://ui-avatars.com/api/?name=${encodeURIComponent(builderName)}&background=6366f1&color=fff&size=128&bold=true`,
    // Quaternary: Discord style with username if available
    discordUsername ? `https://ui-avatars.com/api/?name=${encodeURIComponent(discordUsername)}&background=5865f2&color=fff&size=128&bold=true` : null,
    // Final: Simple initials
    `https://ui-avatars.com/api/?name=${encodeURIComponent(builderName.charAt(0))}&background=8b5cf6&color=fff&size=128&bold=true`
  ].filter(Boolean) as string[];

  const handleImageError = () => {
    if (currentSourceIndex < avatarSources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
    }
  };

  return (
    <Avatar className={className}>
      <AvatarImage 
        src={avatarSources[currentSourceIndex]}
        alt={builderName}
        className="object-cover"
        onError={handleImageError}
      />
      <AvatarFallback className="bg-gradient-to-br from-primary via-primary-glow to-primary-dark text-primary-foreground text-sm font-bold">
        {builderName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarWithFallback;
