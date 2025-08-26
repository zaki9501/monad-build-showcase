
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
  
  // Extract Twitter username from URL with better handling
  const getTwitterUsername = (url?: string) => {
    if (!url) return null;
    try {
      // Handle both twitter.com and x.com URLs
      const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?#]+)/);
      if (match && match[1]) {
        // Remove @ if present and clean the username
        return match[1].replace('@', '').trim();
      }
    } catch (error) {
      console.log('Error parsing Twitter URL:', error);
    }
    return null;
  };

  const twitterUsername = getTwitterUsername(twitterUrl);
  
  // Create multiple reliable avatar sources
  const avatarSources = [
    // Try multiple Twitter avatar services
    twitterUsername ? `https://avatar.vercel.sh/twitter/${twitterUsername}` : null,
    twitterUsername ? `https://avatars.io/twitter/${twitterUsername}` : null,
    twitterUsername ? `https://unavatar.io/twitter/${twitterUsername}` : null,
    
    // Try GitHub if we can extract a username from any GitHub URLs
    twitterUsername ? `https://github.com/${twitterUsername}.png` : null,
    
    // High-quality generated avatars with different styles
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(builderName)}&backgroundColor=6366f1&textColor=ffffff`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(builderName)}&background=6366f1&color=fff&size=128&bold=true&format=svg`,
    
    // Discord-style avatar if available
    discordUsername ? `https://ui-avatars.com/api/?name=${encodeURIComponent(discordUsername)}&background=5865f2&color=fff&size=128&bold=true&format=svg` : null,
    
    // Final fallback with just initials
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(builderName.charAt(0))}&backgroundColor=8b5cf6&textColor=ffffff`
  ].filter(Boolean) as string[];

  const handleImageError = () => {
    console.log(`❌ Avatar source ${currentSourceIndex + 1} failed for ${builderName}:`, avatarSources[currentSourceIndex]);
    
    if (currentSourceIndex < avatarSources.length - 1) {
      const nextIndex = currentSourceIndex + 1;
      setCurrentSourceIndex(nextIndex);
      console.log(`🔄 Trying fallback ${nextIndex + 1} for ${builderName}:`, avatarSources[nextIndex]);
    } else {
      console.log(`💔 All avatar sources exhausted for ${builderName}, using final fallback`);
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
        loading="lazy"
      />
      <AvatarFallback className="bg-gradient-to-br from-primary via-primary-glow to-primary-dark text-primary-foreground text-sm font-bold">
        {builderName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarWithFallback;
