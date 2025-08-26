
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface TwitterProfile {
  profilePicture: string | null;
  bio: string | null;
  verified: boolean;
  loading: boolean;
  cached: boolean;
}

export const useTwitterProfile = (twitterUrl?: string, projectId?: string) => {
  const [profile, setProfile] = useState<TwitterProfile>({
    profilePicture: null,
    bio: null,
    verified: false,
    loading: false,
    cached: false,
  });
  const { toast } = useToast();

  const extractUsername = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
    return match ? match[1] : null;
  };

  const fetchTwitterProfile = async (username: string) => {
    try {
      setProfile(prev => ({ ...prev, loading: true }));
      console.log('Fetching Twitter profile for:', username);

      const { data, error } = await supabase.functions.invoke('fetch-twitter-profile', {
        body: { username, projectId },
      });

      if (error) {
        throw error;
      }

      console.log('Twitter profile data received:', data);

      setProfile({
        profilePicture: data.profilePicture,
        bio: data.bio,
        verified: data.verified,
        loading: false,
        cached: data.cached || false,
      });

    } catch (error) {
      console.error('Error fetching Twitter profile:', error);
      setProfile(prev => ({ ...prev, loading: false }));
      
      // Don't show toast for API errors - just fail silently and use fallbacks
      console.warn('Twitter profile fetch failed, using fallbacks');
    }
  };

  useEffect(() => {
    const username = extractUsername(twitterUrl);
    if (username && username.trim()) {
      console.log('Twitter username extracted:', username);
      fetchTwitterProfile(username);
    } else {
      console.log('No valid Twitter username found in URL:', twitterUrl);
      setProfile({
        profilePicture: null,
        bio: null,
        verified: false,
        loading: false,
        cached: false,
      });
    }
  }, [twitterUrl, projectId]);

  return {
    profile,
    refetch: () => {
      const username = extractUsername(twitterUrl);
      if (username) {
        fetchTwitterProfile(username);
      }
    },
  };
};
