
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarWithFallbackProps {
  builderName: string;
  twitterUrl?: string;
  discordUsername?: string;
  className?: string;
}

export const AvatarWithFallback = ({ 
  builderName, 
  twitterUrl, 
  discordUsername,
  className 
}: AvatarWithFallbackProps) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  // Extract Twitter username from URL
  const getTwitterUsername = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
    return match ? match[1] : null;
  };

  const twitterUsername = getTwitterUsername(twitterUrl);
  
  // Create multiple avatar sources with fallbacks
  const avatarSources = [
    // Primary: Twitter via unavatar.io
    twitterUsername ? `https://unavatar.io/twitter/${twitterUsername}` : null,
    // Secondary: GitHub style avatar with name
    `https://ui-avatars.com/api/?name=${encodeURIComponent(builderName)}&background=6366f1&color=fff&size=128&bold=true`,
    // Tertiary: Discord style with username if available
    discordUsername ? `https://ui-avatars.com/api/?name=${encodeURIComponent(discordUsername)}&background=5865f2&color=fff&size=128&bold=true` : null,
    // Quaternary: Simple initials
    `https://ui-avatars.com/api/?name=${encodeURIComponent(builderName.charAt(0))}&background=8b5cf6&color=fff&size=128&bold=true`
  ].filter(Boolean) as string[];

  const handleImageError = () => {
    console.log(`Avatar source ${currentSourceIndex + 1} failed for ${builderName}:`, avatarSources[currentSourceIndex]);
    
    if (currentSourceIndex < avatarSources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
      console.log(`Trying fallback ${currentSourceIndex + 2} for ${builderName}:`, avatarSources[currentSourceIndex + 1]);
    } else {
      console.log(`All avatar sources exhausted for ${builderName}, using final fallback`);
    }
  };

  const handleImageLoad = () => {
    console.log(`✅ Avatar loaded successfully for ${builderName} using source ${currentSourceIndex + 1}:`, avatarSources[currentSourceIndex]);
  };

  return (
    <Avatar className={className}>
      <AvatarImage 
        src={avatarSources[currentSourceIndex]}
        alt={builderName}
        className="object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      <AvatarFallback className="bg-gradient-to-br from-primary via-primary-glow to-primary-dark text-primary-foreground text-sm font-bold">
        {builderName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarWithFallback;
